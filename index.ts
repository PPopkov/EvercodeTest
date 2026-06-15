import { config } from "./config";
import { db } from "./src/database/connection";
import { migrate } from "./src/database/migrate";
migrate();
import { scheduleService } from "./src/services/schedulerService";
import { log } from "./src/utils/logger";
import { createApp } from "./src/app";

import { createCurrencyService } from "./src/services/currencyService";
import { createCurrencyRepository } from "./src/repository/currencyRepository";
import { createPriceRepository } from "./src/repository/priceRepository";
import { createPriceService } from "./src/services/priceService";
import { createBinanceService } from "./src/services/binanceService";
import { createPriceHistoryRepository } from "./src/repository/priceHistoryRepository";

const currencyRepository = createCurrencyRepository(db);
const priceRepository = createPriceRepository(db);
const currencyService = createCurrencyService(currencyRepository);
const priceHistoryRepository = createPriceHistoryRepository(db);
const binanceService = createBinanceService();
const priceService = createPriceService(
  currencyRepository,
  priceRepository,
  priceHistoryRepository,
  binanceService
);

const stopScheduler = scheduleService(
  priceService,
  config.priceUpdateInterval,
  log
);

const app = createApp(currencyService, priceService);

const server = app.listen(config.port, () => {
  log.info(`Server search on port: ${config.port} `);
});

function shutdown(signal: string) {
  log.info(`Received ${signal}, shutting down...`);

  stopScheduler();

  server.close(() => {
    log.info("HTTP server closed");
    process.exit(0);
  });

  setTimeout(() => {
    log.error("Forced shutdown");
    process.exit(1);
  }, 10000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));