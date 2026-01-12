const paymentService = require("../services/payment.service");
const walletService = require("../services/wallet.service");

const paymentController = {
    // GET /api/wallet/me
    async getMyWallet(req, res, next) {
        try {
            const wallet = await walletService.getWallet(req.user.id);
            return res.json({ success: true, data: wallet });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/wallet/tx
    async getMyWalletTransactions(req, res, next) {
        try {
            const transactions = await walletService.listWalletTx(req.user.id);
            return res.json({ success: true, data: transactions });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/contracts/:id/escrow/fund
    async fundEscrow(req, res, next) {
        try {
            const contractId = req.params.id;
            const employerId = req.user.id;
            const tx = await paymentService.fundEscrow(employerId, contractId);
            return res.status(201).json({ success: true, message: "Escrow funded", data: tx });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/contracts/:id/escrow/release
    async releaseEscrow(req, res, next) {
        try {
            const contractId = req.params.id;
            const employerId = req.user.id;
            const tx = await paymentService.releaseEscrow(employerId, contractId);
            return res.json({ success: true, message: "Escrow released", data: tx });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/contracts/:id/escrow/refund
    async refundEscrow(req, res, next) {
        try {
            const contractId = req.params.id;
            const employerId = req.user.id;
            const tx = await paymentService.refundEscrow(employerId, contractId);
            return res.json({ success: true, message: "Escrow refunded", data: tx });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/wallet/withdrawals
    async requestWithdrawal(req, res, next) {
        try {
            const { amount } = req.body;
            const userId = req.user.id;
            const tx = await paymentService.requestWithdrawal(userId, amount);
            return res.status(201).json({ success: true, message: "Withdrawal request submitted", data: tx });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/withdrawals/:id/approve
    async approveWithdrawal(req, res, next) {
        try {
            const txId = req.params.id;
            const adminId = req.user.id;
            await paymentService.approveWithdrawal(adminId, txId);
            return res.json({ success: true, message: "Withdrawal approved" });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/withdrawals/:id/reject
    async rejectWithdrawal(req, res, next) {
        try {
            const txId = req.params.id;
            const adminId = req.user.id;
            await paymentService.rejectWithdrawal(adminId, txId);
            return res.json({ success: true, message: "Withdrawal rejected" });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = paymentController;
