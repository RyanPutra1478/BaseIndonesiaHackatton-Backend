const applicationService = require("../services/application.service");

const applicationController = {
    // POST /api/jobs/:id/apply
    async applyJob(req, res, next) {
        try {
            const jobId = req.params.id;
            const workerId = req.user.id;
            const { coverLetter } = req.body;

            const application = await applicationService.applyJob(workerId, jobId, coverLetter);

            return res.status(201).json({
                success: true,
                message: "Applied successfully",
                data: application,
            });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/applications/:id/reject
    async rejectApplication(req, res, next) {
        try {
            const applicationId = req.params.id;
            const employerId = req.user.id;

            await applicationService.reject(employerId, applicationId);

            return res.json({
                success: true,
                message: "Application rejected",
            });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/applications/:id/withdraw
    async withdrawApplication(req, res, next) {
        try {
            const applicationId = req.params.id;
            const workerId = req.user.id;

            await applicationService.withdraw(workerId, applicationId);

            return res.json({
                success: true,
                message: "Application withdrawn",
            });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/jobs/:id/applications
    async getApplicationsByJob(req, res, next) {
        try {
            const jobId = req.params.id;
            const employerId = req.user.id;

            const applications = await applicationService.listByJob(employerId, jobId);

            return res.json({
                success: true,
                data: applications,
            });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = applicationController;
