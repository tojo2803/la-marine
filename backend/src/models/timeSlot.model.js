const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");


class TimeSlot extends Model {}

TimeSlot.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    time: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    service: {
      type: DataTypes.ENUM("lunch", "dinner"),
      allowNull: false,
    },
    capacity: {
     
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 20,
      validate: { min: 1 },
    },
    isActive: {
      
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "TimeSlot",
    tableName: "time_slots",
    timestamps: true,
    indexes: [{ unique: true, fields: ["time", "service"] }],
  }
);

module.exports = TimeSlot;
