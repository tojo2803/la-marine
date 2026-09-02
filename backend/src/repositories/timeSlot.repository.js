const { TimeSlot } = require("../models");


const timeSlotRepository = {
  findAll: () => TimeSlot.findAll({ order: [["service", "ASC"], ["time", "ASC"]] }),

  findById: (id) => TimeSlot.findByPk(id),

  findByServiceAndTime: (service, time) => TimeSlot.findOne({ where: { service, time } }),

  updateCapacity: (id, capacity) => TimeSlot.update({ capacity }, { where: { id } }),

  setActive: (id, isActive) => TimeSlot.update({ isActive }, { where: { id } }),

  create: (data) => TimeSlot.create(data),
};

module.exports = timeSlotRepository;
