const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");


class RestaurantSettings extends Model {}

RestaurantSettings.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    
    closedWeekday: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 0, max: 6 },
    },
    minGuestsPerReservation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    maxGuestsPerReservation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 12,
    },
    cancellationDelayHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 24,
    },
  },
  {
    sequelize,
    modelName: "RestaurantSettings",
    tableName: "restaurant_settings",
    timestamps: true,
  }
);

module.exports = RestaurantSettings;
