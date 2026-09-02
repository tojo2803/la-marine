const express = require("express");
const router = express.Router();
const { listTimeSlots, updateCapacity, setActive } = require("../controllers/timeSlot.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

// Publique : nécessaire pour afficher les créneaux disponibles dans le formulaire.
router.get("/", listTimeSlots);

// Protégées : gestion des créneaux depuis le back-office.
router.patch("/:id/capacity", requireAuth, updateCapacity);
router.patch("/:id/active", requireAuth, setActive);

module.exports = router;
