const timeSlotRepository = require("../repositories/timeSlot.repository");
const { catchAsync } = require("../middlewares/errorHandler");
const AppError = require("../utils/AppError");


const listTimeSlots = catchAsync(async (req, res) => {
  const timeSlots = await timeSlotRepository.findAll();
  res.json({ status: "success", data: timeSlots });
});


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


const setActive = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  await timeSlotRepository.setActive(id, Boolean(isActive));
  const updated = await timeSlotRepository.findById(id);
  res.json({ status: "success", data: updated });
});

module.exports = { listTimeSlots, updateCapacity, setActive };
