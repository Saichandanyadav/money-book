const express = require("express");
const router = express.Router();
const { getCountryAndCurrencyData } = require("../controllers/utilController");

router.get("/data", getCountryAndCurrencyData);

module.exports = router;