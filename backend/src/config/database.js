const { Sequelize } = require("sequelize");
require("dotenv").config();

// Instance unique de Sequelize pour toute l'application (point d'entrée unique,
// comme évoqué dans le DP pour simplifier l'injection de dépendance).
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
  }
);

module.exports = sequelize;
