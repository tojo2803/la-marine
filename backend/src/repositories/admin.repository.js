const { Admin } = require("../models");

const adminRepository = {
  // Utilise explicitement le scope "withPassword" car le scope par défaut
  // exclut passwordHash (voir admin.model.js) — seul le login a besoin du hash.
  findByEmailWithPassword: (email) => Admin.scope("withPassword").findOne({ where: { email } }),

  findById: (id) => Admin.findByPk(id),
};

module.exports = adminRepository;
