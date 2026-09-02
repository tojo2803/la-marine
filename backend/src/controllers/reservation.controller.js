const reservationService = require("../services/reservation.service");
const { catchAsync } = require("../middlewares/errorHandler");



const createReservation = catchAsync(async (req, res) => {
  const reservation = await reservationService.createReservation(req.body);
  res.status(201).json({
    status: "success",
    message: "Votre demande de réservation a bien été enregistrée.",
    data: reservation,
  });
});

const listReservations = catchAsync(async (req, res) => {
  const { date, status } = req.query;
  const reservations = await reservationService.listReservations({ date, status });
  res.json({ status: "success", data: reservations });
});


const updateReservationStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const reservation = await reservationService.updateReservationStatus(id, status);
  res.json({ status: "success", data: reservation });
});

module.exports = { createReservation, listReservations, updateReservationStatus };
