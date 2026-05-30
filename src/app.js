const express = require("express");
const app = express();

const swaggerUiExpress = require("swagger-ui-express");
const spec = require("./config/swagger");

const authMiddleware = require("./middleware/auth");

const { createCurrencyService } = require("./services/currencyService");
const binanceService = require("./services/binanceService");
const currencyService = createCurrencyService()
const statusRoute = require("./routes/status");

const {createCurrencyRouter} = require("./routes/currency");
const {createPriceRouter} = require("./routes/price");

app.use(express.json());
app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(spec));

app.use(authMiddleware);
app.use("/currency", createCurrencyRouter(currencyService));
app.use("/price", createPriceRouter(currencyService, binanceService))
app.use("/status", statusRoute);

module.exports = app;