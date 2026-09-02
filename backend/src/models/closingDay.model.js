const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

// Jour de fermeture exceptionnel (jour férié, événement privé, etc.).
// La fermeture hebdomadaire récurrente (ex: le lundi) est gérée séparément
// dans RestaurantSettings.closedWeekday.
class ClosingDay extends Model {}

ClosingDay.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true,
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "ClosingDay",
    tableName: "closing_days",
    timestamps: true,
  }
);

module.exports = ClosingDay;
