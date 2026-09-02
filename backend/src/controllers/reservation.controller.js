const reservationService = require("../services/reservation.service");
const { catchAsync } = require("../middlewares/errorHandler");

// Les controllers restent volontairement "fins" : ils lisent la requête,
// appellent le service, renvoient la réponse. Aucune logique métier ni accès
// base de données direct ici (voir DP : "les routes ne contiennent aucun
// accès direct à la base").

const createReservation = catchAsync(async (req, res) => {
  const reservation = await reservationService.createReservation(req.body);
  res.status(201).json({
    status: "success",
    message: "Votre demande de réservation a bien été enregistrée.",
    data: reservation,
  });
});

// Route protégée (back-office) : liste des réservations, avec filtres optionnels.
const listReservations = catchAsync(async (req, res) => {
  const { date, status } = req.query;
  const reservations = await reservationService.listReservations({ date, status });
  res.json({ status: "success", data: reservations });
});

// Route protégée (back-office) : valider / annuler une réservation.
const updateReservationStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const reservation = await reservationService.updateReservationStatus(id, status);
  res.json({ status: "success", data: reservation });
});

module.exports = { createReservation, listReservations, updateReservationStatus };
