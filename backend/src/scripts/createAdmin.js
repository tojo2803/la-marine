// Petit script pour créer un premier compte administrateur.
// Usage : node src/scripts/createAdmin.js admin@lamarine.fr motdepasse "Nom Prénom"
require("dotenv").config();
const { Admin } = require("../models");
const authService = require("../services/auth.service");

async function run() {
  const [, , email, password, fullName] = process.argv;

  if (!email || !password) {
    console.error("Usage : node src/scripts/createAdmin.js <email> <mot-de-passe> [nom-complet]");
    process.exit(1);
  }

  const passwordHash = await authService.hashPassword(password);
  const admin = await Admin.create({ email, passwordHash, fullName });

  console.log(`Compte administrateur créé : ${admin.email} (id: ${admin.id})`);
  process.exit(0);
}

run().catch((err) => {
  console.error("Erreur lors de la création du compte admin :", err.message);
  process.exit(1);
});
