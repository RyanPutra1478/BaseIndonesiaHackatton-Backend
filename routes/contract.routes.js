const router = require("express").Router();
const contractController = require("../controllers/contract.controller");
const auth = require("../middlewares/authJwt");
const requireRole = require("../middlewares/requireRole");

// Contract Management
router.get("/", auth, contractController.getContracts);
router.get("/:id", auth, contractController.getContract);

router.post("/:id/activate", auth, contractController.activateContract);
router.post("/:id/approve", auth, requireRole("worker"), contractController.approveContract);
router.post("/:id/complete", auth, requireRole("employer"), contractController.completeContract);
router.post("/:id/cancel", auth, contractController.cancelContract);

module.exports = router;
