import express from "express";
import { AddressService } from "../types/services/addressService";

export function createAddressRouter(addressService: AddressService) {
    const router = express.Router();

    /**
     * @openapi
     * /address:
     *   get:
     *     summary: Get all addresses
     *     tags:
     *       - Address
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of addresses
     *       403:
     *         description: Access denied
     */
    router.get("/", (_, res) => {
        const result = addressService.getAll();
        res.status(200).json(result);
    });

    /**
     * @openapi
     * /address/{id}:
     *   get:
     *     summary: Get address by id
     *     tags:
     *       - Address
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
     *         description: Address found
     *       403:
     *         description: Access denied
     *       404:
     *         description: Address not found
     */

    router.get("/:id", (req, res) => {
        const id = Number(req.params.id);
        const result = addressService.getById(id);
        res.status(200).json(result);
    });

    /**
     * @openapi
     * /address:
     *   post:
     *     summary: Create an address
     *     tags:
     *       - Address
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - address
     *               - ticker
     *             properties:
     *               address:
     *                 type: string
     *                 example: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
     *               label:
     *                 type: string
     *                 nullable: true
     *                 example: My wallet
     *               ticker:
     *                 type: string
     *                 example: BTC
     *     responses:
     *       201:
     *         description: Address created
     *       400:
     *         description: Incorrect data
     *       403:
     *         description: Access denied
     *       409:
     *         description: Address already exists
     */

    router.post("/", (req, res) => {
        const data = req.body;
        const result = addressService.create(data.address, data.label, data.ticker);
        res.status(201).json(result);
    });

    /**
     * @openapi
     * /address/{id}:
     *   put:
     *     summary: Update an address
     *     tags:
     *       - Address
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
     *               - ticker
     *             properties:
     *               label:
     *                 type: string
     *                 nullable: true
     *                 example: Main wallet
     *               ticker:
     *                 type: string
     *                 example: BTC
     *     responses:
     *       200:
     *         description: Address updated
     *       400:
     *         description: Incorrect data
     *       403:
     *         description: Access denied
     *       404:
     *         description: Address not found
     */

    router.put("/:id", (req, res) => {
        const id = Number(req.params.id);
        const data = req.body;
        const result = addressService.update(id, data.label ?? null, data.ticker);
        res.status(200).json(result);
    });

    /**
     * @openapi
     * /address/{id}:
     *   delete:
     *     summary: Remove address
     *     tags:
     *       - Address
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
     *         description: Address deleted
     *       403:
     *         description: Access denied
     *       404:
     *         description: Address not found
     */

    router.delete("/:id", (req, res) => {
        const id = Number(req.params.id);
        addressService.delete(id);
        res.sendStatus(204);
    });

    return router;
}
