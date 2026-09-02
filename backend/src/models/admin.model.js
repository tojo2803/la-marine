const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

// Compte administrateur pour l'accès au back-office (dashboard).
// Le mot de passe n'est jamais stocké en clair : voir auth.service.js (bcrypt).
class Admin extends Model {}

Admin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Admin",
    tableName: "admins",
    timestamps: true,
    defaultScope: {
      // Ne jamais renvoyer le hash par défaut dans les requêtes classiques
      attributes: { exclude: ["passwordHash"] },
    },
    scopes: {
      // Utilisé explicitement uniquement lors de la vérification du login
      withPassword: { attributes: {} },
    },
  }
);

module.exports = Admin;
