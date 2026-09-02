const express = require("express");
const router = express.Router();
const { createReservation, listReservations, updateReservationStatus } = require("../controllers/reservation.controller");
const { validateReservationInput } = require("../middlewares/validate");
const { requireAuth } = require("../middlewares/auth.middleware");

// Publique : formulaire de réservation du site.
router.post("/", validateReservationInput, createReservation);

// Protégées : back-office (dashboard admin).
router.get("/", requireAuth, listReservations);
router.patch("/:id/status", requireAuth, updateReservationStatus);

module.exports = router;
