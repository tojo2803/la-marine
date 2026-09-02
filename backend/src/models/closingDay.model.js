const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");


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
