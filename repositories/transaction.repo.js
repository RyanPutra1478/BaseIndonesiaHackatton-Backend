const { Transaction, Job, Contract } = require("../models");

async function create(data, options = {}) {
    return Transaction.create(data, options);
}

async function findById(id, options = {}) {
    return Transaction.findByPk(id, options);
}

async function updateStatus(id, status, options = {}) {
    return Transaction.update({ status }, { where: { id }, ...options });
}

async function listByUser(userId) {
    return Transaction.findAll({
        where: {
            [Op.or]: [{ senderId: userId }, { receiverId: userId }],
        },
        order: [["createdAt", "DESC"]],
    });
}

module.exports = {
    create,
    findById,
    updateStatus,
    listByUser,
};
