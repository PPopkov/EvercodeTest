import express from 'express';
export const router = express.Router()

/**
 * @openapi
 * /status:
 *   get:
 *     summary: Check server status
 *     tags:
 *       - Status
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: ok
 *       401:
 *         description: Token missing
 *       403:
 *         description: Access denied
 */

router.get('/', (req, res) => {
    res.status(200).send('ok');
})