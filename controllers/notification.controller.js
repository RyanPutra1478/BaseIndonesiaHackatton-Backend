const notificationService = require("../services/notification.service");

const notificationController = {
    // GET /api/notifications
    async getNotifications(req, res, next) {
        try {
            const notifications = await notificationService.listMyNotifications(req.user.id);
            return res.json({
                success: true,
                data: notifications,
            });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/notifications/:id/read
    async markRead(req, res, next) {
        try {
            const notificationId = req.params.id;
            const userId = req.user.id;

            await notificationService.markRead(userId, notificationId);

            return res.json({
                success: true,
                message: "Notification marked as read",
            });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/notifications/read-all
    async markReadAll(req, res, next) {
        try {
            const userId = req.user.id;

            await notificationService.markReadAll(userId);

            return res.json({
                success: true,
                message: "All notifications marked as read",
            });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = notificationController;
