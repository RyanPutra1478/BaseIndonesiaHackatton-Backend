const router = require("express").Router();
const ratingController = require("../controllers/rating.controller");
const auth = require("../middlewares/authJwt");

// Public list ratings
router.get("/jobs/:id/ratings", ratingController.getJobRatings);
router.get("/users/:id/ratings", ratingController.getUserRatings);

// Submit rating (Authenticated)
router.post("/jobs/:id/ratings", auth, ratingController.createRating);

module.exports = router;
