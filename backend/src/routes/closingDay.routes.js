const express = require("express");
const router = express.Router();
const { listClosingDays, createClosingDay, deleteClosingDay } = require("../controllers/closingDay.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

router.get("/", listClosingDays);
router.post("/", requireAuth, createClosingDay);
router.delete("/:id", requireAuth, deleteClosingDay);

module.exports = router;
