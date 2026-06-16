import express from "express";
import { BlockchainService } from "../types";


export const createBlockchainRouter = (blockchainService: BlockchainService) => {
    const router = express.Router();

    /**
     * @openapi
     * /blockchain:
     *   get:
     *     summary: Get current blockchain height
     *     tags:
     *       - Blockchain
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: currency
     *         required: true
     *         schema:
     *           type: string
     *         example: BTC
     *     responses:
     *       200:
     *         description: Blockchain height
     *       400:
     *         description: Currency query parameter is required
     *       403:
     *         description: Access denied
     *       404:
     *         description: Currency not found
     */

    router.get("/", (req, res) => {
        const currency = req.query.currency as string;
        if (!currency) {
            res.status(400).json({ error: "Currency query parameter is required" });
            return;
        }
        const result = blockchainService.getHeight(currency);
        res.status(200).json(result);
    });
    return router;
};