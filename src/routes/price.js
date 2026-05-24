const express = require("express");
const router = express.Router();
const currencyService = require("../services/currencyService");
const binanceService = require("../services/binanceService");

/**
 * @openapi
 * /price:
 *   get:
 *     summary: Get all prices by ticker
 *     tags:
 *       - Currency by ticker
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: currency
 *         required: true
 *         schema:
 *           type: string
 *           example: BTC
 *     responses:
 *       200:
 *         description: List of currencies
 *       403:
 *         description: Access denied
 */

router.get("/", async (req, res) => {
  try {
    const ticker = req.query.currency;
    currencyService.getByTicker(ticker);
    const result = await binanceService.getByTicker(ticker);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message });
  }
});

module.exports = router;
