const { Sequelize } = require("sequelize");
require("dotenv").config();

// This creates the single, central sequelize instance for your application
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    // Optional: add logging to see the generated SQL
    // logging: console.log,
  }
);

module.exports = sequelize;
