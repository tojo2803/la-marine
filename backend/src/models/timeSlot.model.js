const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

// Un TimeSlot représente un créneau récurrent (ex: "12h00" pour le service
// "lunch"), avec une capacité maximale de couverts pour ce créneau.
// La disponibilité réelle à une date donnée se calcule en sommant les
// réservations existantes sur ce créneau/cette date (voir reservation.service.js).
class TimeSlot extends Model {}

TimeSlot.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    time: {
      // ex: "12h00", "19h30" — garde le même format que le front-end
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    service: {
      type: DataTypes.ENUM("lunch", "dinner"),
      allowNull: false,
    },
    capacity: {
      // nombre maximum de couverts autorisés sur ce créneau
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 20,
      validate: { min: 1 },
    },
    isActive: {
      // permet de "fermer" un créneau ponctuellement sans le supprimer
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
