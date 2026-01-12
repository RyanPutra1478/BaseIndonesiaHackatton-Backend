const ratingService = require("../services/rating.service");

const ratingController = {
    // POST /api/jobs/:id/ratings
    async createRating(req, res, next) {
        try {
            const jobId = req.params.id;
            const fromUserId = req.user.id;
            const { score, comment } = req.body;

            const rating = await ratingService.createRating(fromUserId, jobId, score, comment);

            return res.status(201).json({
                success: true,
                message: "Rating submitted successfully",
                data: rating,
            });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/jobs/:id/ratings
    async getJobRatings(req, res, next) {
        try {
            const jobId = req.params.id;
            const ratings = await ratingService.listJobRatings(jobId);
            return res.json({
                success: true,
                data: ratings,
            });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/users/:id/ratings
    async getUserRatings(req, res, next) {
        try {
            const userId = req.params.id;
            const ratings = await ratingService.listUserRatings(userId);
            return res.json({
                success: true,
                data: ratings,
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = ratingController;
