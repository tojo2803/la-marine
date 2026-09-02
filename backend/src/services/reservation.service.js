const { sequelize } = require("../models");
const { Transaction } = require("sequelize");
const reservationRepository = require("../repositories/reservation.repository");
const timeSlotRepository = require("../repositories/timeSlot.repository");
const closingDayRepository = require("../repositories/closingDay.repository");
const { RestaurantSettings } = require("../models");
const AppError = require("../utils/AppError");

// ---------------------------------------------------------------------------
// Règles métier définies avec A2SD (voir DP - compétence "Développer des
// composants métier") :
//   - impossible de réserver un jour de fermeture (hebdo ou exceptionnel)
//   - impossible de réserver une date passée
//   - impossible de dépasser la capacité maximale d'un créneau
//   - chaque réservation a un statut : pending / confirmed / cancelled
// ---------------------------------------------------------------------------

function isDateInPast(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const requested = new Date(dateStr);
  return requested < today;
}

async function assertRestaurantOpen(dateStr) {
  const requested = new Date(dateStr);
  const weekday = requested.getDay(); // 0 = dimanche ... 6 = samedi

  const settings = await RestaurantSettings.findOne();
  if (settings && settings.closedWeekday !== null && settings.closedWeekday === weekday) {
    throw new AppError("Le restaurant est fermé ce jour-là.", 400);
  }

  const closingDay = await closingDayRepository.findByDate(dateStr);
  if (closingDay) {
    throw new AppError(
      `Le restaurant est exceptionnellement fermé le ${dateStr}${closingDay.reason ? " (" + closingDay.reason + ")" : ""}.`,
      400
    );
  }
}

const reservationService = {
  /**
   * Crée une réservation après avoir vérifié toutes les règles métier.
   * La vérification de disponibilité + l'écriture se font dans une même
   * transaction avec verrouillage, pour limiter le risque de surréservation
   * en cas de deux demandes simultanées sur le même créneau.
   *
   * NB (voir DP) : ce verrouillage réduit le risque mais la gestion complète
   * de la concurrence (queue, retry) reste une piste de progression identifiée.
   */
  async createReservation(payload) {
    const { firstName, lastName, email, phone, date, service, time, guests, message } = payload;

    if (!firstName || !lastName || !email || !date || !service || !time || !guests) {
      throw new AppError("Merci de renseigner tous les champs obligatoires.", 400);
    }

    if (isDateInPast(date)) {
      throw new AppError("Impossible de réserver une date déjà passée.", 400);
    }

    await assertRestaurantOpen(date);

    const timeSlot = await timeSlotRepository.findByServiceAndTime(service, time);
    if (!timeSlot || !timeSlot.isActive) {
      throw new AppError("Ce créneau n'existe pas ou n'est plus disponible.", 400);
    }

    return sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE },
      async (transaction) => {
        const alreadyBooked = await reservationRepository.sumGuestsForSlot(timeSlot.id, date, transaction);

        if (alreadyBooked + Number(guests) > timeSlot.capacity) {
          // 409 Conflict plutôt que 500 : le client peut afficher "Créneau
          // complet" et proposer un autre créneau (comportement validé avec le tuteur).
          throw new AppError(
            "Ce créneau est complet pour la date demandée. Merci de choisir un autre horaire.",
            409
          );
        }

        return reservationRepository.create(
          {
            firstName,
            lastName,
            email,
            phone,
            date,
            service,
            time,
            guests,
            message,
            status: "pending",
            timeSlotId: timeSlot.id,
          },
          { transaction }
        );
      }
    );
  },

  listReservations(filters) {
    return reservationRepository.findAll(filters);
  },

  async updateReservationStatus(id, status) {
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      throw new AppError("Statut de réservation invalide.", 400);
    }
    const reservation = await reservationRepository.findById(id);
    if (!reservation) {
      throw new AppError("Réservation introuvable.", 404);
    }
    await reservationRepository.updateStatus(id, status);
    return reservationRepository.findById(id);
  },
};

module.exports = reservationService;
