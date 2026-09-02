"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("restaurant_settings", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      closedWeekday: { type: Sequelize.INTEGER, allowNull: true },
      minGuestsPerReservation: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      maxGuestsPerReservation: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 12 },
      cancellationDelayHours: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 24 },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("restaurant_settings");
  },
};
