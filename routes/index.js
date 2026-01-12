const router = require("express").Router();

router.use("/auth", require("./auth.routes"));
router.use("/jobs", require("./job.routes"));
router.use("/contracts", require("./contract.routes"));
router.use("/notifications", require("./notification.routes"));
router.use("/chain-tx", require("./chainTx.routes"));
router.use("/", require("./rating.routes"));
router.use("/", require("./payment.routes"));
router.use("/", require("./application.routes"));

router.get("/", (req, res) => {
    res.json({
        name: "Base Indonesia Hackathon API",
        version: "1.0.0",
        description: "Backend API for Base Indonesia Hackathon Project",
        endpoints: {
            auth: "/api/auth",
            jobs: "/api/jobs",
            contracts: "/api/contracts",
            notifications: "/api/notifications",
            chainTx: "/api/chain-tx"
        },
        status: "active"
    });
});

module.exports = router;
