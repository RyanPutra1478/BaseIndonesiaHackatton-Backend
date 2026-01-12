const router = require("express").Router();
const jobController = require("../controllers/job.controller");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/authJwt");
const requireRole = require("../middlewares/requireRole");
const { createJobSchema, patchJobSchema, queryJobSchema } = require("../validators/job.schema");

// Public routes
router.get("/", validate(queryJobSchema), jobController.getJobs);
router.get("/:id", jobController.getJob);

// Employer routes
router.post(
    "/",
    auth,
    requireRole("employer"),
    validate(createJobSchema),
    jobController.createJob
);

router.patch(
    "/:id",
    auth,
    requireRole("employer"),
    validate(patchJobSchema),
    jobController.updateJob
);

router.post(
    "/:id/publish",
    auth,
    requireRole("employer"),
    jobController.publishJob
);

router.post(
    "/:id/close",
    auth,
    requireRole("employer"),
    jobController.closeJob
);

router.post(
    "/:id/cancel",
    auth,
    requireRole("employer"),
    jobController.cancelJob
);

router.delete(
    "/:id",
    auth,
    requireRole("employer"),
    jobController.deleteJob
);

module.exports = router;
