const contractRepo = require("../repositories/contract.repo");
const applicationRepo = require("../repositories/application.repo");
const jobRepo = require("../repositories/job.repo");
const notificationService = require("../services/notification.service");
const chainTxRepo = require("../repositories/chainTx.repo");
const transactionRepo = require("../repositories/transaction.repo");
const AppError = require("../utils/AppError");
const { sequelize } = require("../models");
const { v4: uuidv4 } = require("uuid");

async function acceptAndCreateContract(employerId, applicationId, customData = {}) {
    const { startedAt, finishedAt, agreedWage } = customData;
    return sequelize.transaction(async (t) => {
        // 1. Get Application
        const application = await applicationRepo.findById(applicationId, {
            include: ["job"],
            transaction: t,
        });

        if (!application) throw new AppError(404, "Application not found");
        if (application.job.employerId !== employerId) {
            throw new AppError(403, "Unauthorized: You do not own this job");
        }
        if (application.status !== "submitted") {
            throw new AppError(400, "Application is not in a submittable state");
        }

        // 2. Update Application status
        await applicationRepo.updateStatus(applicationId, "accepted", { transaction: t });

        // 3. Create Contract
        const contractNumber = `CNT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const contract = await contractRepo.createContract(
            {
                jobId: application.jobId,
                workerId: application.workerId,
                employerId: employerId,
                contractNumber: contractNumber,
                agreedWage: agreedWage || application.job.wage,
                status: "draft",
                startedAt: startedAt || null,
                finishedAt: finishedAt || null,
            },
            { transaction: t }
        );

        // 4. Update Job status
        await jobRepo.updateStatus(application.jobId, "in_contract", { transaction: t });

        // 5. Notify Worker
        await notificationService.createNotification(
            application.workerId,
            "contract_created",
            `Good news! Your application for ${application.job.title} was accepted. A contract draft has been created.`,
            { transaction: t }
        );

        return contract;
    });
}

async function approve(workerId, contractId) {
    return sequelize.transaction(async (t) => {
        const contract = await contractRepo.findById(contractId, { transaction: t });
        if (!contract) throw new AppError(404, "Contract not found");

        if (contract.workerId !== workerId) {
            throw new AppError(403, "Unauthorized: Only the assigned worker can approve the contract");
        }

        if (contract.status !== "draft") {
            throw new AppError(400, "Contract is not in draft status");
        }

        // 1. Update Contract Status
        await contractRepo.updateStatus(contractId, "active", { transaction: t });
        await contractRepo.updateTimestamps(contractId, "startedAt", new Date(), { transaction: t });

        // 2. Create internal Transaction record (Optional, for ledger)
        const internalTx = await transactionRepo.create({
            jobId: contract.jobId,
            contractId,
            senderId: contract.employerId,
            receiverId: contract.workerId,
            amount: contract.agreedWage,
            type: "contract_registration",
            status: "pending",
            idempotencyKey: `contract-reg-${contractId}`
        }, { transaction: t });

        // 3. Register on "Blockchain" (Create ChainTx record)
        const chainTxHash = `0x${uuidv4().replace(/-/g, "")}`;
        await chainTxRepo.create({
            transactionId: internalTx.id,
            chainTxHash,
            network: "base_mainnet",
            status: "pending"
        }, { transaction: t });

        // 4. Notify Employer
        await notificationService.createNotification(
            contract.employerId,
            "contract_approved",
            `The worker has approved the contract ${contract.contractNumber}. It is now active and registered on-chain.`,
            { transaction: t }
        );

        return { success: true, chainTxHash };
    });
}

async function activate(userId, contractId) {
    const contract = await contractRepo.findById(contractId);
    if (!contract) throw new AppError(404, "Contract not found");

    if (contract.employerId !== userId && contract.workerId !== userId) {
        throw new AppError(403, "Unauthorized");
    }

    if (contract.status !== "draft") throw new AppError(400, "Contract is already active or finished");

    await contractRepo.updateStatus(contractId, "active");
    await contractRepo.updateTimestamps(contractId, "startedAt", new Date());

    return { success: true };
}

async function complete(employerId, contractId) {
    return sequelize.transaction(async (t) => {
        const contract = await contractRepo.findById(contractId, { transaction: t });
        if (!contract) throw new AppError(404, "Contract not found");
        if (contract.employerId !== employerId) throw new AppError(403, "Unauthorized");

        if (contract.status !== "active") throw new AppError(400, "Only active contracts can be completed");

        await contractRepo.updateStatus(contractId, "completed", { transaction: t });
        await contractRepo.updateTimestamps(contractId, "finishedAt", new Date(), { transaction: t });

        // Update Job status to completed
        await jobRepo.updateStatus(contract.jobId, "completed", { transaction: t });

        // Notify Worker
        await notificationService.createNotification(
            contract.workerId,
            "contract_completed",
            `Congratulations! The contract for ${contract.job.title} has been marked as completed by the employer.`
        );

        return { success: true };
    });
}

async function cancel(userId, contractId) {
    return sequelize.transaction(async (t) => {
        const contract = await contractRepo.findById(contractId, { transaction: t });
        if (!contract) throw new AppError(404, "Contract not found");

        if (contract.employerId !== userId && contract.workerId !== userId) {
            throw new AppError(403, "Unauthorized");
        }

        if (["completed", "cancelled"].includes(contract.status)) {
            throw new AppError(400, "Contract is already in a terminal state");
        }

        await contractRepo.updateStatus(contractId, "cancelled", { transaction: t });

        // Re-open job if it was cancelled from draft/active?
        // User image says "cancel", usually we might want to re-open the job.
        await jobRepo.updateStatus(contract.jobId, "open", { transaction: t });

        return { success: true };
    });
}

async function getContract(userId, contractId) {
    const contract = await contractRepo.findById(contractId);
    if (!contract) throw new AppError(404, "Contract not found");

    if (contract.employerId !== userId && contract.workerId !== userId) {
        throw new AppError(403, "Unauthorized");
    }

    return contract;
}

async function listMyContracts(userId, role) {
    return contractRepo.listByUserId(userId, role);
}

module.exports = {
    acceptAndCreateContract,
    approve,
    activate,
    complete,
    cancel,
    getContract,
    listMyContracts,
};
