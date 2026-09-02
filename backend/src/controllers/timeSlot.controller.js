const timeSlotRepository = require("../repositories/timeSlot.repository");
const { catchAsync } = require("../middlewares/errorHandler");
const AppError = require("../utils/AppError");

// Publique : la liste des créneaux sert à afficher les options possibles
// côté formulaire de réservation.
const listTimeSlots = catchAsync(async (req, res) => {
  const timeSlots = await timeSlotRepository.findAll();
  res.json({ status: "success", data: timeSlots });
});

// Protégée (back-office) : modifier la capacité d'un créneau.
const updateCapacity = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { capacity } = req.body;
  if (!Number.isInteger(Number(capacity)) || Number(capacity) < 1) {
    throw new AppError("La capacité doit être un nombre entier positif.", 400);
  }
  await timeSlotRepository.updateCapacity(id, capacity);
  const updated = await timeSlotRepository.findById(id);
  res.json({ status: "success", data: updated });
});

// Protégée (back-office) : ouvrir/fermer un créneau ponctuellement.
const setActive = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  await timeSlotRepository.setActive(id, Boolean(isActive));
  const updated = await timeSlotRepository.findById(id);
  res.json({ status: "success", data: updated });
});

module.exports = { listTimeSlots, updateCapacity, setActive };
