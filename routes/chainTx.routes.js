const router = require("express").Router();
const chainTxController = require("../controllers/chainTx.controller");
const auth = require("../middlewares/authJwt");
const requireRole = require("../middlewares/requireRole");

// Reconciliation (Usually Admin or Worker process)
router.post("/reconcile", auth, requireRole("admin"), chainTxController.reconcile);

// Query
router.get("/:id", auth, chainTxController.getChainTx);

module.exports = router;
