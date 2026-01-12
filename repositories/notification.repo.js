const { Notification } = require("../models");

async function create(data, options = {}) {
    return Notification.create(data, options);
}

async function listByUser(userId) {
    return Notification.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
    });
}

async function markAsRead(id, userId) {
    return Notification.update(
        { isRead: true },
        { where: { id, userId } }
    );
}

async function markAllAsRead(userId) {
    return Notification.update(
        { isRead: true },
        { where: { userId, isRead: false } }
    );
}

module.exports = {
    create,
    listByUser,
    markAsRead,
    markAllAsRead,
};
