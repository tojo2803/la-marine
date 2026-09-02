const AppError = require("../utils/AppError");

// Middleware d'erreur centralisé. Toute route/service qui lève une erreur
// (via next(err) ou une exception dans un handler async enveloppé) arrive ici.
//
// - Erreur "opérationnelle" (AppError) -> message clair renvoyé au client
//   avec le bon code HTTP (ex: 409 Conflict, 400 Bad Request).
// - Erreur inattendue (bug, connexion DB perdue, etc.) -> on ne renvoie
//   jamais le détail technique au client (sécurité), on logue côté serveur
//   et on répond 500 avec un message générique.
function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Erreurs de validation Sequelize (contraintes non respectées)
  if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      status: "error",
      message: "Données invalides : " + err.errors.map((e) => e.message).join(", "),
    });
  }

  // Erreur non prévue : on logue le détail côté serveur uniquement.
  console.error("Erreur inattendue :", err);
  return res.status(500).json({
    status: "error",
    message: "Une erreur interne est survenue. Veuillez réessayer plus tard.",
  });
}

// Petit utilitaire pour éviter d'écrire try/catch dans chaque controller async.
function catchAsync(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

module.exports = { errorHandler, catchAsync };
