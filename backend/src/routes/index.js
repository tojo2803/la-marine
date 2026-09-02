const express = require("express");
const router = express.Router();

router.use("/reservations", require("./reservation.routes"));
router.use("/time-slots", require("./timeSlot.routes"));
router.use("/closing-days", require("./closingDay.routes"));
router.use("/auth", require("./auth.routes"));

module.exports = router;
