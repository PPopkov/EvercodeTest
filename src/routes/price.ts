import express from "express";
import { PriceService } from "../types/services/priceService";

export const createPriceRouter = (priceService: PriceService) => {
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
    const ticker = req.query.currency as string;
    if (!ticker) {
      res.status(400).json({ error: "Currency query parameter is required" });
      return;
    }
    const result = priceService.getPricesByTicker(ticker);
    res.status(200).json(result);
  });

  router.get("/history", (req, res) => {
    const ticker = req.query.currency as string;
    if (!ticker) {
      res.status(400).json({ error: "Currency query parameter is required" });
      return;
    }
    const result = priceService.getPriceHistory(ticker);
    res.status(200).json(result);
  });
  return router;
};
