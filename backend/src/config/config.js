// Config utilisée par sequelize-cli (migrations / seeders) — voir aussi database.js
// pour l'instance Sequelize réellement utilisée par l'application.
require("dotenv").config();

const common = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "postgres",
};

// Le SSL n'est activé que si explicitement demandé (DB_SSL=true), par exemple
// pour un vrai hébergeur cloud qui l'exige. En local (Docker ou PostgreSQL
// natif), PostgreSQL n'a pas SSL activé par défaut, donc on ne le force pas.
const sslOptions =
  process.env.DB_SSL === "true"
    ? { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } }
    : {};

module.exports = {
  development: common,
  test: { ...common, database: `${process.env.DB_NAME}_test` },
  production: { ...common, ...sslOptions },
};
