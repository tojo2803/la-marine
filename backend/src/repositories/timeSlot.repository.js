const { TimeSlot } = require("../models");

// Toutes les méthodes passent par les méthodes de modèle Sequelize
// (findAll, findOne, create...), qui génèrent des requêtes préparées
// (paramétrées) en interne — jamais de concaténation de SQL.
const timeSlotRepository = {
  findAll: () => TimeSlot.findAll({ order: [["service", "ASC"], ["time", "ASC"]] }),

  findById: (id) => TimeSlot.findByPk(id),

  findByServiceAndTime: (service, time) => TimeSlot.findOne({ where: { service, time } }),

  updateCapacity: (id, capacity) => TimeSlot.update({ capacity }, { where: { id } }),

  setActive: (id, isActive) => TimeSlot.update({ isActive }, { where: { id } }),

  create: (data) => TimeSlot.create(data),
};

module.exports = timeSlotRepository;
