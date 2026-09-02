const app = require("./app");
const sequelize = require("./config/database");

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Connexion à la base de données PostgreSQL réussie.");

    app.listen(PORT, () => {
      console.log(`Serveur La Marine démarré sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Impossible de démarrer le serveur :", err.message);
    process.exit(1);
  }
}

start();
