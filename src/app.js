const express = require("express");
const app = express();

const swaggerUiExpress = require("swagger-ui-express");
const spec = require("./config/swagger");

const authMiddleware = require("./middleware/auth");

const currency = require("./routes/currency");
const priceCurrency = require("./routes/price");
const statusRoute = require("./routes/status");



app.use(express.json());
app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
app.use(authMiddleware);
app.use("/currency", currency);
app.use("/price", priceCurrency)
app.use("/status", statusRoute);

module.exports = app;