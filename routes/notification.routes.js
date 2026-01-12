const router = require("express").Router();
const notificationController = require("../controllers/notification.controller");
const auth = require("../middlewares/authJwt");

router.get("/", auth, notificationController.getNotifications);
router.post("/read-all", auth, notificationController.markReadAll);
router.post("/:id/read", auth, notificationController.markRead);

module.exports = router;
