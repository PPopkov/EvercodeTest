const express = require("express");
const router = express.Router();
const currencyService = require("../services/currencyService");
const binanceService = require("../services/binanceService");

router.get("/",async (req, res) => {
  try {
    const ticker = req.query.currency;
    currencyService.getByTicker(ticker);
    const result = await binanceService.getByTicker(ticker);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message });
  }
});

module.exports = router