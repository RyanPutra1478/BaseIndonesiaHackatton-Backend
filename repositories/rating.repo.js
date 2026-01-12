const { Rating, User } = require("../models");

async function create(data) {
    return Rating.create(data);
}

async function findByJob(jobId) {
    return Rating.findAll({
        where: { jobId },
        include: [
            { model: User, as: "fromUser", attributes: ["id", "name"] },
            { model: User, as: "toUser", attributes: ["id", "name"] },
        ],
        order: [["createdAt", "DESC"]],
    });
}

async function findByUser(userId) {
    return Rating.findAll({
        where: { toUserId: userId },
        include: [
            { model: User, as: "fromUser", attributes: ["id", "name"] }
        ],
        order: [["createdAt", "DESC"]],
    });
}

module.exports = {
    create,
    findByJob,
    findByUser,
};
