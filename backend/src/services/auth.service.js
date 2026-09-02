const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminRepository = require("../repositories/admin.repository");
const AppError = require("../utils/AppError");

// Authentification JWT pour le back-office (dashboard admin) — mise en place
// suite à la piste de progression identifiée dans le DP ("Définir
// l'architecture logicielle" : authentification renforcée par jetons JWT).
const authService = {
  async login(email, password) {
    if (!email || !password) {
      throw new AppError("Email et mot de passe requis.", 400);
    }

    const admin = await adminRepository.findByEmailWithPassword(email);
    if (!admin) {

      throw new AppError("Identifiants invalides.", 401);
    }

    const passwordMatches = await bcrypt.compare(password, admin.passwordHash);
    if (!passwordMatches) {
      throw new AppError("Identifiants invalides.", 401);
    }

    const token = jwt.sign(
      { sub: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
    );

    return { token, admin: { id: admin.id, email: admin.email, fullName: admin.fullName } };
  },

  async hashPassword(plainPassword) {
    const saltRounds = 10;
    return bcrypt.hash(plainPassword, saltRounds);
  },
};

module.exports = authService;
