const sequelize = require("../config/database");
const TimeSlot = require("./timeSlot.model");
const Reservation = require("./reservation.model");
const ClosingDay = require("./closingDay.model");
const RestaurantSettings = require("./restaurantSettings.model");
const Admin = require("./admin.model");

TimeSlot.hasMany(Reservation, { foreignKey: "timeSlotId", as: "reservations" });
Reservation.belongsTo(TimeSlot, { foreignKey: "timeSlotId", as: "timeSlot" });

module.exports = {
  sequelize,
  TimeSlot,
  Reservation,
  ClosingDay,
  RestaurantSettings,
  Admin,
};
