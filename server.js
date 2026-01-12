const app = require("./app");
const { sequelize } = require("./models");

const port = process.env.PORT || 3000;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connection has been established successfully.");

        app.listen(port, () => {
            console.log(`🚀 API listening on port ${port}`);
            console.log(`🌍 http://localhost:${port}`);
        });
    } catch (error) {
        console.error("❌ Unable to connect to the database:");
        console.error(error.message);
        process.exit(1);
    }
}

startServer();
