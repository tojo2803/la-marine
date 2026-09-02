const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");


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

      attributes: { exclude: ["passwordHash"] },
    },
    scopes: {
     
      withPassword: { attributes: {} },
    },
  }
);

module.exports = Admin;
