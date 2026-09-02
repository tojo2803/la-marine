const { Reservation, TimeSlot, sequelize } = require("../models");
const { Op } = require("sequelize");

const reservationRepository = {
  create: (data, options = {}) => Reservation.create(data, options),

  findById: (id) => Reservation.findByPk(id, { include: [{ model: TimeSlot, as: "timeSlot" }] }),

  findAll: (filters = {}) => {
    const where = {};
    if (filters.date) where.date = filters.date;
    if (filters.status) where.status = filters.status;

    return Reservation.findAll({
      where,
      include: [{ model: TimeSlot, as: "timeSlot" }],
      order: [
        ["date", "ASC"],
        ["time", "ASC"],
      ],
    });
  },

  updateStatus: (id, status) => Reservation.update({ status }, { where: { id } }),

  sumGuestsForSlot: async (timeSlotId, date, transaction) => {
    const total = await Reservation.sum("guests", {
      where: {
        timeSlotId,
        date,
        status: { [Op.in]: ["pending", "confirmed"] },
      },
      transaction,
    });
    return total || 0;
  },

  sequelize, 
};

module.exports = reservationRepository;
