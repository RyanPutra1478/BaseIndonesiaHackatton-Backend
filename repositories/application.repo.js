const { Application, User } = require("../models");

async function createApplication(data, options = {}) {
    return Application.create(data, options);
}

async function findById(id, options = {}) {
    return Application.findByPk(id, options);
}

async function findByJobAndWorker(jobId, workerId) {
    return Application.findOne({ where: { jobId, workerId } });
}

async function listByJobId(jobId) {
    return Application.findAll({
        where: { jobId },
        include: [
            {
                model: User,
                as: "worker",
                attributes: ["id", "name", "email", "kycStatus"],
            },
        ],
        order: [["createdAt", "DESC"]],
    });
}

async function updateStatus(id, status, options = {}) {
    return Application.update({ status }, { where: { id }, ...options });
}

module.exports = {
    createApplication,
    findById,
    findByJobAndWorker,
    listByJobId,
    updateStatus,
};
