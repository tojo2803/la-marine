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

  // Somme des couverts déjà réservés (statuts pending + confirmed) pour un
  // créneau donné à une date donnée. Utilisée par le service pour vérifier
  // la capacité disponible avant de créer une nouvelle réservation.
  //
  // Exécutée dans une transaction avec verrouillage (voir reservation.service.js)
  // afin d'éviter qu'une réservation concurrente ne soit acceptée entre la
  // vérification et l'écriture (cf. piste de progression identifiée dans le DP).
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

  sequelize, // exposé uniquement pour la gestion de transaction dans le service
};

module.exports = reservationRepository;
