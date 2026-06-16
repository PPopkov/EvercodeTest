import express from "express";

import swaggerUiExpress from "swagger-ui-express";
import { spec } from "./config/swagger";

import { authMiddleware } from "./middleware/auth";
import { errorHandler } from "./middleware/errorHandler";
import { router as statusRoute } from "./routes/status";

import { createCurrencyRouter } from "./routes/currency";
import { createPriceRouter } from "./routes/price";
import { createAddressRouter } from "./routes/address";

import { CurrencyService } from "./types/services/currencyService";
import { PriceService } from "./types/services/priceService";
import { AddressService } from "./types";

export function createApp(
  currencyService: CurrencyService,
  priceService: PriceService,
  addressService: AddressService
) {
  const app = express();

  app.use(express.json());
  app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(spec));

  app.use(authMiddleware);
  app.use("/currency", createCurrencyRouter(currencyService));
  app.use("/price", createPriceRouter(priceService));
  app.use("/address", createAddressRouter(addressService));
  app.use("/status", statusRoute);

  app.use(errorHandler);

  return app;
}
