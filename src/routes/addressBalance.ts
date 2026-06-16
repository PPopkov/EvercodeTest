import express from "express";
import { AddressBalanceService, AddressService } from "../types";

export function createAddressBalanceRouter(
    addressBalanceService: AddressBalanceService,
    addressService: AddressService
) {
    const router = express.Router();

    /**
     * @openapi
     * /address/{id}/balance:
     *   get:
     *     summary: Get address balance by id
     *     tags:
     *       - Address Balance
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
     *         description: Address balance found
     *       403:
     *         description: Access denied
     *       404:
     *         description: Address not found or address balance not found
     */

    router.get("/:id/balance", (req, res) => {
        const id = Number(req.params.id);
        const addr = addressService.getById(id);
        const balance = addressBalanceService.getByAddress(addr.address);
        res.status(200).json(balance);
    });

    return router;
}
