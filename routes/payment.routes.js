const router = require("express").Router();
const paymentController = require("../controllers/payment.controller");
const auth = require("../middlewares/authJwt");
const requireRole = require("../middlewares/requireRole");

// Wallet info
router.get("/wallet/me", auth, paymentController.getMyWallet);
router.get("/wallet/tx", auth, paymentController.getMyWalletTransactions);

// Escrow management
router.post("/contracts/:id/escrow/fund", auth, requireRole("employer"), paymentController.fundEscrow);
router.post("/contracts/:id/escrow/release", auth, requireRole("employer"), paymentController.releaseEscrow);
router.post("/contracts/:id/escrow/refund", auth, requireRole("employer"), paymentController.refundEscrow);

// Withdrawals
router.post("/wallet/withdrawals", auth, paymentController.requestWithdrawal);
router.post("/withdrawals/:id/approve", auth, requireRole("admin"), paymentController.approveWithdrawal);
router.post("/withdrawals/:id/reject", auth, requireRole("admin"), paymentController.rejectWithdrawal);

module.exports = router;
