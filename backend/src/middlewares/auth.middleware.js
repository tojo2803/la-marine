const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Authentification requise.", 401));
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    next(new AppError("Session expirée ou invalide, merci de vous reconnecter.", 401));
  }
}

module.exports = { requireAuth };
