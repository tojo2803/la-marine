const AppError = require("../utils/AppError");


function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }


  if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      status: "error",
      message: "Données invalides : " + err.errors.map((e) => e.message).join(", "),
    });
  }


  console.error("Erreur inattendue :", err);
  return res.status(500).json({
    status: "error",
    message: "Une erreur interne est survenue. Veuillez réessayer plus tard.",
  });
}


function catchAsync(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

module.exports = { errorHandler, catchAsync };
