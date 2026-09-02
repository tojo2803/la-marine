const AppError = require("../utils/AppError");

// Validation "à l'entrée" des données envoyées par le client, avant même
// d'atteindre la couche service/base de données — cohérent avec la règle
// rappelée dans le DP : "ne jamais faire confiance au client".
// La validation métier plus fine (disponibilité, jour de fermeture...) reste
// dans reservation.service.js.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/; // format attendu : YYYY-MM-DD

function validateReservationInput(req, res, next) {
  const { firstName, lastName, email, date, service, time, guests } = req.body;

  if (!firstName || typeof firstName !== "string" || !firstName.trim()) {
    return next(new AppError("Le prénom est obligatoire.", 400));
  }
  if (!lastName || typeof lastName !== "string" || !lastName.trim()) {
    return next(new AppError("Le nom est obligatoire.", 400));
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    return next(new AppError("L'adresse email est invalide.", 400));
  }
  if (!date || !DATE_REGEX.test(date)) {
    return next(new AppError("La date est invalide (format attendu : AAAA-MM-JJ).", 400));
  }
  if (!["lunch", "dinner"].includes(service)) {
    return next(new AppError("Le service doit être 'lunch' ou 'dinner'.", 400));
  }
  if (!time || typeof time !== "string") {
    return next(new AppError("L'horaire est obligatoire.", 400));
  }
  const guestsNumber = Number(guests);
  if (!Number.isInteger(guestsNumber) || guestsNumber < 1 || guestsNumber > 12) {
    return next(new AppError("Le nombre de personnes doit être compris entre 1 et 12.", 400));
  }

  next();
}

module.exports = { validateReservationInput };
