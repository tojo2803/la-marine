const { Admin } = require("../models");

const adminRepository = {

  findByEmailWithPassword: (email) => Admin.scope("withPassword").findOne({ where: { email } }),

  findById: (id) => Admin.findByPk(id),
};

module.exports = adminRepository;
