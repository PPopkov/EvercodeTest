const express = require("express");

const createPriceRouter = (priceService) => {
  const router = express.Router();

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

  router.get("/", (req, res) => {
      const ticker = req.query.currency;
      const result = priceService.getPricesByTicker(ticker);
      res.status(200).json(result);
  });

  return router;
};

module.exports = { createPriceRouter };
