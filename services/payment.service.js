const { sequelize } = require("../models");
const walletRepo = require("../repositories/wallet.repo");
const walletTxRepo = require("../repositories/walletTx.repo");
const transactionRepo = require("../repositories/transaction.repo");
const contractRepo = require("../repositories/contract.repo");
const notificationService = require("../services/notification.service");
const AppError = require("../utils/AppError");
const { v4: uuidv4 } = require("uuid");

async function fundEscrow(employerId, contractId) {
    return sequelize.transaction(async (t) => {
        const contract = await contractRepo.findById(contractId, { transaction: t });
        if (!contract) throw new AppError(404, "Contract not found");
        if (contract.employerId !== employerId) throw new AppError(403, "Unauthorized");
        if (contract.status !== "active" && contract.status !== "draft") throw new AppError(400, "Invalid contract state");

        const amount = Number(contract.agreedWage);
        const wallet = await walletRepo.findByUserId(employerId, {
            transaction: t,
            lock: t.LOCK.UPDATE,
        });

        if (Number(wallet.availableBalance) < amount) {
            throw new AppError(400, "Insufficient balance to fund escrow");
        }

        const idempotencyKey = `escrow-fund-${contractId}`;

        // 1. Create Transaction record
        const tx = await transactionRepo.create(
            {
                contractId,
                senderId: employerId,
                receiverId: contract.workerId,
                amount,
                type: "escrow_fund",
                status: "success",
                idempotencyKey,
            },
            { transaction: t }
        );

        // 2. Update Balances
        const newAvailable = Number(wallet.availableBalance) - amount;
        const newLocked = Number(wallet.lockedBalance) + amount;
        await walletRepo.updateBalances(employerId, newAvailable, newLocked, { transaction: t });

        // 3. Log Wallet Transaction
        await walletTxRepo.create(
            {
                userId: employerId,
                amount: -amount,
                type: "escrow_lock",
                referenceType: "Transaction",
                referenceId: tx.id,
                idempotencyKey: `wallet-lock-${idempotencyKey}`,
            },
            { transaction: t }
        );

        await notificationService.createNotification(
            employerId,
            "escrow_funded",
            `You have successfully funded ${amount} for contract ${contract.contractNumber}.`
        );

        return tx;
    });
}

async function releaseEscrow(employerId, contractId) {
    return sequelize.transaction(async (t) => {
        const contract = await contractRepo.findById(contractId, { transaction: t });
        if (!contract) throw new AppError(404, "Contract not found");
        if (contract.employerId !== employerId) throw new AppError(403, "Unauthorized");
        if (contract.status !== "completed") throw new AppError(400, "Contract must be completed before release");

        const amount = Number(contract.agreedWage);
        const employerWallet = await walletRepo.findByUserId(employerId, {
            transaction: t,
            lock: t.LOCK.UPDATE,
        });
        const workerWallet = await walletRepo.findByUserId(contract.workerId, {
            transaction: t,
            lock: t.LOCK.UPDATE,
        });

        if (Number(employerWallet.lockedBalance) < amount) {
            throw new AppError(400, "Insufficient locked balance to release");
        }

        const idempotencyKey = `escrow-release-${contractId}`;

        // 1. Create Transaction
        const tx = await transactionRepo.create(
            {
                contractId,
                senderId: employerId,
                receiverId: contract.workerId,
                amount,
                type: "escrow_release",
                status: "success",
                idempotencyKey,
            },
            { transaction: t }
        );

        // 2. Update Employer Balance (Deduct Locked)
        await walletRepo.updateBalances(
            employerId,
            employerWallet.availableBalance,
            Number(employerWallet.lockedBalance) - amount,
            { transaction: t }
        );

        // 3. Update Worker Balance (Add Available)
        await walletRepo.updateBalances(
            contract.workerId,
            Number(workerWallet.availableBalance) + amount,
            workerWallet.lockedBalance,
            { transaction: t }
        );

        // 4. Log Wallet Transactions
        await walletTxRepo.create(
            {
                userId: employerId,
                amount: 0, // No change to available, just ledger note for locked decrease
                type: "escrow_release",
                referenceType: "Transaction",
                referenceId: tx.id,
                idempotencyKey: `wallet-release-employer-${idempotencyKey}`,
            },
            { transaction: t }
        );

        await walletTxRepo.create(
            {
                userId: contract.workerId,
                amount: amount,
                type: "escrow_release",
                referenceType: "Transaction",
                referenceId: tx.id,
                idempotencyKey: `wallet-release-worker-${idempotencyKey}`,
            },
            { transaction: t }
        );

        await notificationService.createNotification(
            contract.workerId,
            "payment_received",
            `Payment of ${amount} for contract ${contract.contractNumber} has been released to your wallet.`
        );

        return tx;
    });
}

async function refundEscrow(employerId, contractId) {
    return sequelize.transaction(async (t) => {
        const contract = await contractRepo.findById(contractId, { transaction: t });
        if (!contract) throw new AppError(404, "Contract not found");
        if (contract.employerId !== employerId) throw new AppError(403, "Unauthorized");
        if (contract.status !== "active" && contract.status !== "cancelled") throw new AppError(400, "Invalid state for refund");

        const amount = Number(contract.agreedWage);
        const wallet = await walletRepo.findByUserId(employerId, {
            transaction: t,
            lock: t.LOCK.UPDATE,
        });

        if (Number(wallet.lockedBalance) < amount) {
            throw new AppError(400, "Insufficient locked balance to refund");
        }

        const idempotencyKey = `escrow-refund-${contractId}`;

        const tx = await transactionRepo.create(
            {
                contractId,
                senderId: employerId,
                receiverId: employerId,
                amount,
                type: "escrow_refund",
                status: "success",
                idempotencyKey,
            },
            { transaction: t }
        );

        await walletRepo.updateBalances(
            employerId,
            Number(wallet.availableBalance) + amount,
            Number(wallet.lockedBalance) - amount,
            { transaction: t }
        );

        await walletTxRepo.create(
            {
                userId: employerId,
                amount: amount,
                type: "escrow_refund",
                referenceType: "Transaction",
                referenceId: tx.id,
                idempotencyKey: `wallet-refund-${idempotencyKey}`,
            },
            { transaction: t }
        );

        return tx;
    });
}

async function requestWithdrawal(userId, amount) {
    return sequelize.transaction(async (t) => {
        const wallet = await walletRepo.findByUserId(userId, { transaction: t, lock: t.LOCK.UPDATE });
        if (Number(wallet.availableBalance) < amount) throw new AppError(400, "Insufficient balance");

        const idempotencyKey = `withdraw-${userId}-${Date.now()}`;

        // Create transaction record (pending)
        const tx = await transactionRepo.create({
            senderId: userId,
            amount,
            type: "withdrawal_request",
            status: "pending",
            idempotencyKey
        }, { transaction: t });

        // Lock the balance (Available -> Locked)
        await walletRepo.updateBalances(
            userId,
            Number(wallet.availableBalance) - amount,
            Number(wallet.lockedBalance) + amount,
            { transaction: t }
        );

        await walletTxRepo.create({
            userId,
            amount: -amount,
            type: "withdrawal_hold",
            referenceType: "Transaction",
            referenceId: tx.id,
            idempotencyKey: `withdraw-hold-${idempotencyKey}`
        }, { transaction: t });

        return tx;
    });
}

async function approveWithdrawal(adminId, txId) {
    return sequelize.transaction(async (t) => {
        const tx = await transactionRepo.findById(txId, { transaction: t });
        if (!tx || tx.type !== "withdrawal_request") throw new AppError(404, "Withdrawal request not found");
        if (tx.status !== "pending") throw new AppError(400, "Withdrawal is already processed");

        const userId = tx.senderId;
        const wallet = await walletRepo.findByUserId(userId, { transaction: t, lock: t.LOCK.UPDATE });

        // Finalize (Remove from Locked)
        await walletRepo.updateBalances(
            userId,
            wallet.availableBalance,
            Number(wallet.lockedBalance) - Number(tx.amount),
            { transaction: t }
        );

        await walletTxRepo.create({
            userId,
            amount: 0,
            type: "withdrawal_release",
            referenceType: "Transaction",
            referenceId: tx.id,
            idempotencyKey: `withdraw-release-${tx.id}`
        }, { transaction: t });

        await transactionRepo.updateStatus(txId, "success", { transaction: t });

        await notificationService.createNotification(
            userId,
            "withdrawal_approved",
            `Your withdrawal request of ${tx.amount} has been approved.`
        );

        return { success: true };
    });
}

async function rejectWithdrawal(adminId, txId) {
    return sequelize.transaction(async (t) => {
        const tx = await transactionRepo.findById(txId, { transaction: t });
        if (!tx || tx.type !== "withdrawal_request") throw new AppError(404, "Withdrawal request not found");
        if (tx.status !== "pending") throw new AppError(400, "Withdrawal is already processed");

        const userId = tx.senderId;
        const wallet = await walletRepo.findByUserId(userId, { transaction: t, lock: t.LOCK.UPDATE });

        // Refund (Locked -> Available)
        await walletRepo.updateBalances(
            userId,
            Number(wallet.availableBalance) + Number(tx.amount),
            Number(wallet.lockedBalance) - Number(tx.amount),
            { transaction: t }
        );

        await transactionRepo.updateStatus(txId, "failed", { transaction: t });

        await notificationService.createNotification(
            userId,
            "withdrawal_rejected",
            `Your withdrawal request of ${tx.amount} was rejected. Funds have been returned to your wallet.`
        );

        return { success: true };
    });
}

module.exports = {
    fundEscrow,
    releaseEscrow,
    refundEscrow,
    requestWithdrawal,
    approveWithdrawal,
    rejectWithdrawal,
};
