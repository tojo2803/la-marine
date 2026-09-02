"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("reservations", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      firstName: { type: Sequelize.STRING(100), allowNull: false },
      lastName: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING(255), allowNull: false },
      phone: { type: Sequelize.STRING(20), allowNull: true },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      service: { type: Sequelize.ENUM("lunch", "dinner"), allowNull: false },
      time: { type: Sequelize.STRING(5), allowNull: false },
      guests: { type: Sequelize.INTEGER, allowNull: false },
      message: { type: Sequelize.TEXT, allowNull: true },
      status: {
        type: Sequelize.ENUM("pending", "confirmed", "cancelled"),
        allowNull: false,
        defaultValue: "pending",
      },
      timeSlotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "time_slots", key: "id" },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
    await queryInterface.addIndex("reservations", ["date", "timeSlotId"]);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("reservations");
  },
};
