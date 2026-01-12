const { WalletTx } = require("../models");

async function create(data, options = {}) {
    return WalletTx.create(data, options);
}

async function listByUser(userId) {
    return WalletTx.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
    });
}

module.exports = {
    create,
    listByUser,
};
