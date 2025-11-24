const express = require("express");
const router = express.Router();
const { getPaymentMethods, addPaymentMethod } = require("../controllers/paymentMethodController");
const protect = require("../middleware/authMiddleware");

router.get("/", protect, getPaymentMethods);
router.post("/", protect, addPaymentMethod);

module.exports = router;