// Erreur "contrôlée" : celle qu'on lève volontairement dans le code métier
// (ex: 409 Conflict si créneau complet, 400 si données invalides, 404 si
// ressource introuvable). Le errorHandler s'en sert pour distinguer une
// erreur attendue d'un vrai bug/crash (voir middlewares/errorHandler.js).
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
