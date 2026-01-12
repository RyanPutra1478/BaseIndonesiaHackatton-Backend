const applicationRepo = require("../repositories/application.repo");
const jobRepo = require("../repositories/job.repo");
const notificationService = require("../services/notification.service");
const AppError = require("../utils/AppError");

async function applyJob(workerId, jobId, coverLetter) {
    const job = await jobRepo.findById(jobId);
    if (!job) throw new AppError(404, "Job not found");
    if (job.status !== "open") throw new AppError(400, "Job is not open for applications");
    if (job.employerId === workerId) throw new AppError(400, "You cannot apply to your own job");

    const existing = await applicationRepo.findByJobAndWorker(jobId, workerId);
    if (existing) throw new AppError(409, "You have already applied for this job");

    const application = await applicationRepo.createApplication({
        jobId,
        workerId,
        coverLetter,
        status: "submitted",
    });

    // Notify Employer
    await notificationService.createNotification(
        job.employerId,
        "new_application",
        `A new worker has applied for your job: ${job.title}`
    );

    return application;
}

async function reject(employerId, applicationId) {
    const application = await applicationRepo.findById(applicationId, {
        include: ["job"],
    });

    if (!application) throw new AppError(404, "Application not found");
    if (application.job.employerId !== employerId) {
        throw new AppError(403, "Unauthorized: You do not own this job");
    }

    await applicationRepo.updateStatus(applicationId, "rejected");

    // Notify Worker
    await notificationService.createNotification(
        application.workerId,
        "application_rejected",
        `Your application for ${application.job.title} was rejected.`
    );

    return { success: true };
}

async function withdraw(workerId, applicationId) {
    const application = await applicationRepo.findById(applicationId);
    if (!application) throw new AppError(404, "Application not found");
    if (application.workerId !== workerId) {
        throw new AppError(403, "Unauthorized: This is not your application");
    }

    await applicationRepo.updateStatus(applicationId, "withdrawn");
    return { success: true };
}

async function listByJob(employerId, jobId) {
    const job = await jobRepo.findById(jobId);
    if (!job) throw new AppError(404, "Job not found");
    if (job.employerId !== employerId) {
        throw new AppError(403, "Unauthorized: You do not own this job");
    }

    return applicationRepo.listByJobId(jobId);
}

module.exports = {
    applyJob,
    reject,
    withdraw,
    listByJob,
};
