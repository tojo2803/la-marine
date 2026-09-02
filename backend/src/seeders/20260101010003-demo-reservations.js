"use strict";

// Jeu de données de démonstration : plusieurs réservations avec des statuts
// différents (pending / confirmed / cancelled), sur des dates et créneaux
// variés, pour visualiser un dashboard réaliste. À ne pas lancer avec le
// script de test testScenarios.js (qui crée ses propres données jetables).

function isoInDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    // Récupère les ids des créneaux déjà seedés (12h30 déjeuner et 19h30 dîner)
    const [lunchSlot] = await queryInterface.sequelize.query(
      `SELECT id FROM time_slots WHERE service = 'lunch' AND time = '12h30' LIMIT 1;`
    );
    const [dinnerSlot] = await queryInterface.sequelize.query(
      `SELECT id FROM time_slots WHERE service = 'dinner' AND time = '19h30' LIMIT 1;`
    );
    const lunchSlotId = lunchSlot[0]?.id;
    const dinnerSlotId = dinnerSlot[0]?.id;

    if (!lunchSlotId || !dinnerSlotId) {
      console.warn("Seeder demo-reservations : créneaux introuvables, lance d'abord le seeder time-slots.");
      return;
    }

    await queryInterface.bulkInsert("reservations", [
      {
        firstName: "Camille",
        lastName: "Rousseau",
        email: "camille.rousseau@exemple.fr",
        phone: "0611223344",
        date: isoInDays(1),
        service: "lunch",
        time: "12h30",
        guests: 2,
        message: "Table près de la fenêtre si possible",
        status: "confirmed",
        timeSlotId: lunchSlotId,
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: "Julien",
        lastName: "Faure",
        email: "julien.faure@exemple.fr",
        phone: "0622334455",
        date: isoInDays(1),
        service: "dinner",
        time: "19h30",
        guests: 5,
        message: "Anniversaire, une bougie svp",
        status: "pending",
        timeSlotId: dinnerSlotId,
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: "Sophie",
        lastName: "Lemoine",
        email: "sophie.lemoine@exemple.fr",
        phone: "0633445566",
        date: isoInDays(2),
        service: "lunch",
        time: "12h30",
        guests: 3,
        message: null,
        status: "pending",
        timeSlotId: lunchSlotId,
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: "Thomas",
        lastName: "Girard",
        email: "thomas.girard@exemple.fr",
        phone: "0644556677",
        date: isoInDays(3),
        service: "dinner",
        time: "19h30",
        guests: 6,
        message: "Allergie aux fruits de mer",
        status: "confirmed",
        timeSlotId: dinnerSlotId,
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: "Léa",
        lastName: "Petit",
        email: "lea.petit@exemple.fr",
        phone: "0655667788",
        date: isoInDays(0),
        service: "dinner",
        time: "19h30",
        guests: 2,
        message: null,
        status: "cancelled",
        timeSlotId: dinnerSlotId,
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: "Antoine",
        lastName: "Blanchard",
        email: "antoine.blanchard@exemple.fr",
        phone: "0666778899",
        date: isoInDays(0),
        service: "lunch",
        time: "12h30",
        guests: 4,
        message: "Terrasse souhaitée",
        status: "confirmed",
        timeSlotId: lunchSlotId,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  down: async (queryInterface) => {
    const { Op } = require("sequelize");
    await queryInterface.bulkDelete("reservations", { email: { [Op.like]: "%@exemple.fr" } }, {});
  },
};
