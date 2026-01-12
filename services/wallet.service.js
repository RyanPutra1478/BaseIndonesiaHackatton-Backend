const walletRepo = require("../repositories/wallet.repo");
const walletTxRepo = require("../repositories/walletTx.repo");
const AppError = require("../utils/AppError");

async function getWallet(userId) {
    const wallet = await walletRepo.findByUserId(userId);
    if (!wallet) throw new AppError(404, "Wallet not found");
    return wallet;
}

async function listWalletTx(userId) {
    return walletTxRepo.listByUser(userId);
}

module.exports = {
    getWallet,
    listWalletTx,
};
