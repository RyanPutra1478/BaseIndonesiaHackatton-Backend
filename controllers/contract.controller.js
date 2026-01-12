const contractService = require("../services/contract.service");

const contractController = {
    // POST /api/applications/:id/accept
    async acceptApplication(req, res, next) {
        try {
            const applicationId = req.params.id;
            const employerId = req.user.id;
            const { startedAt, finishedAt, agreedWage } = req.body;

            const contract = await contractService.acceptAndCreateContract(employerId, applicationId, {
                startedAt,
                finishedAt,
                agreedWage
            });

            return res.status(201).json({
                success: true,
                message: "Application accepted and contract created",
                data: contract,
            });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/contracts/:id/approve
    async approveContract(req, res, next) {
        try {
            const contractId = req.params.id;
            const workerId = req.user.id;

            const result = await contractService.approve(workerId, contractId);

            return res.json({
                success: true,
                message: "Contract approved and registered on blockchain",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/contracts/:id/activate
    async activateContract(req, res, next) {
        try {
            const contractId = req.params.id;
            const userId = req.user.id;

            await contractService.activate(userId, contractId);

            return res.json({
                success: true,
                message: "Contract activated",
            });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/contracts/:id/complete
    async completeContract(req, res, next) {
        try {
            const contractId = req.params.id;
            const employerId = req.user.id;

            await contractService.complete(employerId, contractId);

            return res.json({
                success: true,
                message: "Contract completed successfully",
            });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/contracts/:id/cancel
    async cancelContract(req, res, next) {
        try {
            const contractId = req.params.id;
            const userId = req.user.id;

            await contractService.cancel(userId, contractId);

            return res.json({
                success: true,
                message: "Contract cancelled",
            });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/contracts/:id
    async getContract(req, res, next) {
        try {
            const contractId = req.params.id;
            const userId = req.user.id;

            const contract = await contractService.getContract(userId, contractId);

            return res.json({
                success: true,
                data: contract,
            });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/contracts
    async getContracts(req, res, next) {
        try {
            const userId = req.user.id;
            const role = req.user.role;

            const contracts = await contractService.listMyContracts(userId, role);

            return res.json({
                success: true,
                data: contracts,
            });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = contractController;
