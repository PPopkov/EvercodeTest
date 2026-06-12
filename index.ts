const config = require("./config");
const db = require("./src/database/connection");
const migrate = require("./src/database/migrate");
migrate();
const { scheduleService } = require("./src/services/schedulerService");
const { log } = require("./src/utils/logger");
const { createApp } = require("./src/app");

const { createCurrencyService } = require("./src/services/currencyService");
const {
  createCurrencyRepository,
} = require("./src/repository/currencyRepository");
const { createPriceRepository } = require("./src/repository/priceRepository");
const { createPriceService } = require("./src/services/priceService");
const { createBinanceService } = require("./src/services/binanceService");

const currencyRepository = createCurrencyRepository(db);
const priceRepository = createPriceRepository(db);
const currencyService = createCurrencyService(currencyRepository);
const binanceService = createBinanceService();
const priceService = createPriceService(
  currencyRepository,
  priceRepository,
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