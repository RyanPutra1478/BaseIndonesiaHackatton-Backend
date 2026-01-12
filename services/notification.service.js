const notificationRepo = require("../repositories/notification.repo");

async function createNotification(userId, type, message, options = {}) {
    try {
        await notificationRepo.create({
            userId,
            type,
            message,
            isRead: false,
        }, options);
    } catch (error) {
        console.error("Failed to create notification:", error);
        // Non-blocking
    }
}

async function listMyNotifications(userId) {
    return notificationRepo.listByUser(userId);
}

async function markRead(userId, notificationId) {
    return notificationRepo.markAsRead(notificationId, userId);
}

async function markReadAll(userId) {
    return notificationRepo.markAllAsRead(userId);
}

module.exports = {
    createNotification,
    listMyNotifications,
    markRead,
    markReadAll,
};
