const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

// Une réservation correspond à un client qui réserve un créneau (TimeSlot)
// à une date précise. Les coordonnées du client sont stockées directement
// sur la réservation (pas de table Client séparée pour ce projet) : c'est un
// choix de simplification assumé, cohérent avec la taille du projet.
class Reservation extends Model {}

Reservation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: true },
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: true },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    date: {
      // Date souhaitée de la réservation (jour)
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    service: {
      type: DataTypes.ENUM("lunch", "dinner"),
      allowNull: false,
    },
    time: {
     
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    guests: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
    timeSlotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Reservation",
    tableName: "reservations",
    timestamps: true,
    indexes: [{ fields: ["date", "timeSlotId"] }],
  }
);

module.exports = Reservation;
