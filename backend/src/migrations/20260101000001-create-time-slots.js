"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("time_slots", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      time: { type: Sequelize.STRING(5), allowNull: false },
      service: { type: Sequelize.ENUM("lunch", "dinner"), allowNull: false },
      capacity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 20 },
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
    await queryInterface.addIndex("time_slots", ["time", "service"], { unique: true });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("time_slots");
  },
};
