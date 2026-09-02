"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    await queryInterface.bulkInsert("restaurant_settings", [
      {
        // Le front-end (ReservationPage.vue) indique "Lundi : fermé" -> 1 = lundi
        closedWeekday: 1,
        minGuestsPerReservation: 1,
        maxGuestsPerReservation: 12,
        cancellationDelayHours: 24,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete("restaurant_settings", null, {});
  },
};
