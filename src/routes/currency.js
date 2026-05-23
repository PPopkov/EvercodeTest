const express = require("express");
const router = express.Router();
const currencyService = require("../services/currencyService");

router.get("/", (req, res) => {
  try {
    const result = currencyService.getAll();
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message });
  }
});

router.get("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = currencyService.getById(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message });
  }
});

router.post("/", (req, res) => {
  try {
    const data = req.body;
    const result = currencyService.create(data.name, data.ticker);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message });
  }
});

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
