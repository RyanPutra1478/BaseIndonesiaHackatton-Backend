require("dotenv").config();

const config = {
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || null,
  database: process.env.DB_NAME || "gig_economy_db",
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  dialect: "mysql",
  dialectOptions: {
    ssl: process.env.DB_SSL === "true" ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
};

module.exports = {
  development: config,
  production: {
    ...config,
    dialectOptions: {
      ssl: process.env.DB_SSL === "true" ? {
        require: true,
        rejectUnauthorized: true // More strict in production
      } : false
    }
  }
};
