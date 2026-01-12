const chainTxRepo = require("../repositories/chainTx.repo");
const transactionRepo = require("../repositories/transaction.repo");
const notificationService = require("../services/notification.service");
const AppError = require("../utils/AppError");
const { sequelize } = require("../models");

async function reconcileChainEvent(chainTxHash, network, status, blockNumber = null) {
    return sequelize.transaction(async (t) => {
        // 1. Find the ChainTx entry
        const chainTx = await chainTxRepo.findByHash(chainTxHash);
        if (!chainTx) {
            // In some cases, we might want to create a dangling ChainTx if it's unexpected
            // but usually we expect to have broadcasted it first.
            throw new AppError(404, "Blockchain transaction hash not found in registry");
        }

        // 2. Update status if it changed
        if (chainTx.status !== status) {
            await chainTxRepo.updateStatus(chainTx.id, status, blockNumber, { transaction: t });

            // 3. Sync internal Transaction status
            let internalStatus = "pending";
            if (status === "confirmed") internalStatus = "success";
            if (status === "reverted") internalStatus = "failed";

            if (chainTx.transactionId) {
                await transactionRepo.updateStatus(chainTx.transactionId, internalStatus, { transaction: t });

                const internalTx = chainTx.transaction;
                // 4. Notify sender/receiver
                if (internalTx) {
                    const message = status === "confirmed"
                        ? `Your transaction ${chainTxHash} has been confirmed on ${network}.`
                        : `Your transaction ${chainTxHash} has reverted on ${network}. Please check.`;

                    await notificationService.createNotification(internalTx.senderId, "chain_tx_reconciled", message);
                    if (internalTx.receiverId && internalTx.receiverId !== internalTx.senderId) {
                        await notificationService.createNotification(internalTx.receiverId, "chain_tx_reconciled", message);
                    }
                }
            }
        }

        return { success: true };
    });
}

async function getChainTx(id) {
    const tx = await chainTxRepo.findById(id);
    if (!tx) throw new AppError(404, "Chain transaction not found");
    return tx;
}

module.exports = {
    reconcileChainEvent,
    getChainTx,
};
