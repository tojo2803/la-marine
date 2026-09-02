const authService = require("../services/auth.service");
const { catchAsync } = require("../middlewares/errorHandler");

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.json({ status: "success", data: result });
});

module.exports = { login };
