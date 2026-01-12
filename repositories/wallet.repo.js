const { Wallet } = require("../models");

async function findByUserId(userId, options = {}) {
    return Wallet.findOne({ where: { userId }, ...options });
}

async function updateBalances(userId, available, locked, options = {}) {
    return Wallet.update(
        { availableBalance: available, lockedBalance: locked },
        { where: { userId }, ...options }
    );
}

module.exports = {
    findByUserId,
    updateBalances,
};
