const ratingRepo = require("../repositories/rating.repo");
const contractRepo = require("../repositories/contract.repo");
const notificationService = require("../services/notification.service");
const AppError = require("../utils/AppError");

async function createRating(fromUserId, jobId, score, comment) {
    // 1. Verify that a completed contract exists for this job involving this user
    const contracts = await contractRepo.listByUserId(fromUserId, null);
    const contract = contracts.find(c => c.jobId === parseInt(jobId));

    if (!contract) {
        throw new AppError(403, "You can only rate jobs you participated in");
    }

    if (contract.status !== "completed") {
        throw new AppError(400, "You can only rate after the contract is completed");
    }

    // 2. Determine who to rate
    let toUserId;
    if (contract.employerId === fromUserId) {
        toUserId = contract.workerId; // Employer rating Worker
    } else if (contract.workerId === fromUserId) {
        toUserId = contract.employerId; // Worker rating Employer
    } else {
        throw new AppError(403, "Unauthorized to rate this contract");
    }

    // 3. Create Rating
    const rating = await ratingRepo.create({
        jobId,
        fromUserId,
        toUserId,
        score,
        comment
    });

    // 4. Notify Target
    await notificationService.createNotification(
        toUserId,
        "new_rating",
        `You received a ${score}-star rating for your work on job #${jobId}.`
    );

    return rating;
}

async function listJobRatings(jobId) {
    return ratingRepo.findByJob(jobId);
}

async function listUserRatings(userId) {
    return ratingRepo.findByUser(userId);
}

module.exports = {
    createRating,
    listJobRatings,
    listUserRatings
};
