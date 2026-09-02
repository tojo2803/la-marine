const { ClosingDay } = require("../models");

const closingDayRepository = {
  findAll: () => ClosingDay.findAll({ order: [["date", "ASC"]] }),

  findByDate: (date) => ClosingDay.findOne({ where: { date } }),

  create: (data) => ClosingDay.create(data),

  deleteById: (id) => ClosingDay.destroy({ where: { id } }),
};

module.exports = closingDayRepository;
