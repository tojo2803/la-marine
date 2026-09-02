"use strict";

// Reprend exactement les créneaux proposés dans le formulaire de réservation
// du front-end (ReservationPage.vue), pour que la disponibilité calculée par
// le backend corresponde à ce que le client peut sélectionner.
const LUNCH_TIMES = ["12h00", "12h15", "12h30", "13h00", "13h15", "13h30"];
const DINNER_TIMES = ["19h00", "19h15", "19h30", "20h00", "20h15", "20h30"];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const rows = [
      ...LUNCH_TIMES.map((time) => ({
        time,
        service: "lunch",
        capacity: 20,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      })),
      ...DINNER_TIMES.map((time) => ({
        time,
        service: "dinner",
        capacity: 20,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      })),
    ];
    await queryInterface.bulkInsert("time_slots", rows);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete("time_slots", null, {});
  },
};
