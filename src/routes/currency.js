const express = require("express");
const router = express.Router();
const currencyService = require("../services/currencyService");

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

router.get("/", (req, res) => {
  try {
    const result = currencyService.getAll();
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message });
  }
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
 *     responses:
 *         200:
 *           description: List of currencies
 *         403:
 *           description: Access denied
 *         404:
 *           description: Currency not found
 */

router.get("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = currencyService.getById(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message });
  }
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bitcoin
 *               ticker:
 *                 type: string
 *                 example: BTC
 *     responses:
 *       201:
 *         description: Currency created
 *       400:
 *         description: Incorrect data
 *       403:
 *         description: Access denied
 */

router.post("/", (req, res) => {
  try {
    const data = req.body;
    const result = currencyService.create(data.name, data.ticker);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message });
  }
});

/**
 * @openapi
 * /currency/{id}:
 *   put:
 *     summary: Make changes to the currency
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bitcoin
 *               ticker:
 *                 type: string
 *                 example: BTC
 *     responses:
 *       200:
 *         description: Currency created
 *       400:
 *         description: Incorrect data
 *       403:
 *         description: Access denied
 *
 */

router.put("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const result = currencyService.update(id, data.name, data.ticker);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message });
  }
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
 *     responses:
 *         200:
 *           description: List of currencies
 *         403:
 *           description: Access denied
 *         404:
 *           description: Currency not found
 */

router.delete("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = currencyService.remove(id);
    res.status(204).json(result);
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message });
  }
});

module.exports = router;
