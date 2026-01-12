const app = require("./app");
const { sequelize } = require("./models");

const port = process.env.PORT || 3000;
const host = "0.0.0.0";

// startServer is now a non-blocking orchestrator
function startServer() {
    // 1. First, start listening so Railway/Healthchecks are happy
    const server = app.listen(port, host, () => {
        console.log(`🚀 Server is "ALIVE" and listening on ${host}:${port}`);
        console.log(`🌍 Health Check: http://localhost:${port}/health`);
    });

    // 2. Then, attempt database connection in the background
    console.log("⏳ Attempting to connect to the database in background...");
    sequelize.authenticate()
        .then(() => {
            console.log("✅ Database connection has been established successfully.");
        })
        .catch((error) => {
            console.error("❌ Database connection FAILED:");
            console.error(error.message);
            console.log("⚠️ Application is running in DEGRADED mode (DB Offline).");
            console.log("� Check your .env credentials and network connection.");
        });
}

startServer();
