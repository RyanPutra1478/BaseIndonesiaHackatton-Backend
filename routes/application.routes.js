const router = require("express").Router();
const applicationController = require("../controllers/application.controller");
const contractController = require("../controllers/contract.controller");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/authJwt");
const requireRole = require("../middlewares/requireRole");
const { applyJobSchema } = require("../validators/application.schema");

// Routes for applying to a job
// Prefix in index.js will handle parts of this, but specifically:
// User requested: POST /api/jobs/:id/apply
// So we mount this specifically or define it in a way that index.js can mount it.

// For simplicity and matching the diagram:
// POST /api/jobs/:id/apply
router.post(
    "/jobs/:id/apply",
    auth,
    requireRole("worker"),
    validate(applyJobSchema),
    applicationController.applyJob
);

// GET /api/jobs/:id/applications
router.get(
    "/jobs/:id/applications",
    auth,
    requireRole("employer"),
    applicationController.getApplicationsByJob
);

// Routes for managing applications by ID
// POST /api/applications/:id/accept
router.post(
    "/applications/:id/accept",
    auth,
    requireRole("employer"),
    contractController.acceptApplication
);

// POST /api/applications/:id/reject
router.post(
    "/applications/:id/reject",
    auth,
    requireRole("employer"),
    applicationController.rejectApplication
);

// POST /api/applications/:id/withdraw
router.post(
    "/applications/:id/withdraw",
    auth,
    requireRole("worker"),
    applicationController.withdrawApplication
);

module.exports = router;
