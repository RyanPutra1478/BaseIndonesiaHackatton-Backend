const chainTxService = require("../services/chainTx.service");

const chainTxController = {
    // POST /api/chain-tx/reconcile
    // This would typically be called by a Listener worker or an Admin
    async reconcile(req, res, next) {
        try {
            const { chainTxHash, network, status, blockNumber } = req.body;

            if (!chainTxHash || !network || !status) {
                return res.status(400).json({ success: false, message: "Missing required fields" });
            }

            await chainTxService.reconcileChainEvent(chainTxHash, network, status, blockNumber);

            return res.json({
                success: true,
                message: "Blockchain transaction reconciled successfully",
            });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/chain-tx/:id
    async getChainTx(req, res, next) {
        try {
            const tx = await chainTxService.getChainTx(req.params.id);
            return res.json({
                success: true,
                data: tx,
            });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = chainTxController;
