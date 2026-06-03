const express = require("express");

const swaggerUiExpress = require("swagger-ui-express");
const spec = require("./config/swagger");

const authMiddleware = require("../src/middleware/auth");
const errorHandler = require("../src/middleware/errorHandler");
const statusRoute = require("./routes/status");

const { createCurrencyRouter } = require("./routes/currency");
const { createPriceRouter  } = require("./routes/price");

function createApp(currencyService, priceService) {
  const app = express();

  app.use(express.json());
  app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(spec));

  app.use(authMiddleware);
  app.use("/currency", createCurrencyRouter(currencyService));
  app.use("/price", createPriceRouter(priceService ));
  app.use("/status", statusRoute);

  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
