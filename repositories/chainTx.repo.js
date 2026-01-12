const { ChainTx, Transaction } = require("../models");

async function create(data, options = {}) {
    return ChainTx.create(data, options);
}

async function findById(id) {
    return ChainTx.findByPk(id, {
        include: [{ model: Transaction, as: "transaction" }]
    });
}

async function findByHash(chainTxHash) {
    return ChainTx.findOne({
        where: { chainTxHash },
        include: [{ model: Transaction, as: "transaction" }]
    });
}

async function updateStatus(id, status, chainBlockNumber = null, options = {}) {
    const updateData = { status };
    if (chainBlockNumber) {
        updateData.chainBlockNumber = chainBlockNumber;
    }
    return ChainTx.update(updateData, { where: { id }, ...options });
}

module.exports = {
    create,
    findById,
    findByHash,
    updateStatus,
};
