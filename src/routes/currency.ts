import express from "express";
import { CurrencyService } from "../types/services/currencyService";

export function createCurrencyRouter(currencyService: CurrencyService) {
  const router = express.Router();

  /**
   * @openapi
   * /currency:
   *   get:
   *     summary: Get all currencies
   *     tags:
   *       - Currency
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of currencies
   *       403:
   *         description: Access denied
   */

  router.get("/", (_, res) => {
    const result = currencyService.getAll();
    res.status(200).json(result);
  });

  /**
   * @openapi
   * /currency/{id}:
   *   get:
   *     summary: Get currency by id
   *     tags:
   *       - Currency
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         example: 1
   *     responses:
   *       200:
   *         description: Currency found
   *       403:
   *         description: Access denied
   *       404:
   *         description: Currency not found
   */

  router.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    const result = currencyService.getById(id);
    res.status(200).json(result);
  });

  /**
   * @openapi
   * /currency:
   *   post:
   *     summary: Create a currency
   *     tags:
   *       - Currency
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - ticker
   *               - blockchain
   *             properties:
   *               name:
   *                 type: string
   *                 example: Bitcoin
   *               ticker:
   *                 type: string
   *                 example: BTC
   *               blockchain:
   *                 type: string
   *                 description: Blockchair chain name (lowercase)
   *                 example: bitcoin
   *     responses:
   *       201:
   *         description: Currency created
   *       400:
   *         description: Incorrect data
   *       403:
   *         description: Access denied
   *       409:
   *         description: Ticker already exists
   */

  router.post("/", (req, res) => {
    const data = req.body;
    const result = currencyService.create(data.name, data.ticker, data.blockchain);
    res.status(201).json(result);
  });

  /**
   * @openapi
   * /currency/{id}:
   *   put:
   *     summary: Update a currency
   *     tags:
   *       - Currency
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         example: 1
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - ticker
   *               - blockchain
   *             properties:
   *               name:
   *                 type: string
   *                 example: Bitcoin
   *               ticker:
   *                 type: string
   *                 example: BTC
   *               blockchain:
   *                 type: string
   *                 description: Blockchair chain name (lowercase)
   *                 example: bitcoin
   *     responses:
   *       200:
   *         description: Currency updated
   *       400:
   *         description: Incorrect data
   *       403:
   *         description: Access denied
   *       404:
   *         description: Currency not found
   *       409:
   *         description: Ticker already exists
   */

  router.put("/:id", (req, res) => {
    const id = Number(req.params.id);
    const data = req.body;
    const result = currencyService.update(id, data.name, data.ticker, data.blockchain);
    res.status(200).json(result);
  });

  /**
   * @openapi
   * /currency/{id}:
   *   delete:
   *     summary: Remove currency
   *     tags:
   *       - Currency
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         example: 1
   *     responses:
   *       204:
   *         description: Currency deleted
   *       403:
   *         description: Access denied
   *       404:
   *         description: Currency not found
   */

  router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    currencyService.remove(id);
    res.sendStatus(204);
  });


  return router;
}

