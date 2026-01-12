const { Contract, User, Job } = require("../models");

async function createContract(data, options = {}) {
    return Contract.create(data, options);
}

async function findById(id, options = {}) {
    return Contract.findByPk(id, {
        include: [
            { model: Job, as: "job" },
            { model: User, as: "worker", attributes: ["id", "name", "email"] },
            { model: User, as: "employer", attributes: ["id", "name", "email"] },
        ],
        ...options,
    });
}

async function listByUserId(userId, role) {
    const where = {};
    if (role === "employer") {
        where.employerId = userId;
    } else {
        where.workerId = userId;
    }

    return Contract.findAll({
        where,
        include: [{ model: Job, as: "job" }],
        order: [["createdAt", "DESC"]],
    });
}

async function updateStatus(id, status, options = {}) {
    return Contract.update({ status }, { where: { id }, ...options });
}

async function updateTimestamps(id, field, value, options = {}) {
    return Contract.update({ [field]: value }, { where: { id }, ...options });
}

module.exports = {
    createContract,
    findById,
    listByUserId,
    updateStatus,
    updateTimestamps,
};
