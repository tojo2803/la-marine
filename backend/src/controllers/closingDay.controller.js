const closingDayRepository = require("../repositories/closingDay.repository");
const { catchAsync } = require("../middlewares/errorHandler");
const AppError = require("../utils/AppError");

const listClosingDays = catchAsync(async (req, res) => {
  const closingDays = await closingDayRepository.findAll();
  res.json({ status: "success", data: closingDays });
});


const createClosingDay = catchAsync(async (req, res) => {
  const { date, reason } = req.body;
  if (!date) {
    throw new AppError("La date est obligatoire.", 400);
  }
  const existing = await closingDayRepository.findByDate(date);
  if (existing) {
    throw new AppError("Ce jour est déjà marqué comme fermé.", 409);
  }
  const closingDay = await closingDayRepository.create({ date, reason });
  res.status(201).json({ status: "success", data: closingDay });
});

const deleteClosingDay = catchAsync(async (req, res) => {
  const { id } = req.params;
  await closingDayRepository.deleteById(id);
  res.status(204).send();
});

module.exports = { listClosingDays, createClosingDay, deleteClosingDay };
