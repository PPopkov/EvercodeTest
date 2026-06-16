import { config } from "./config";
import { db } from "./src/database/connection";
import { migrate } from "./src/database/migrate";
migrate();
import { scheduleService } from "./src/services/schedulerService";
import { log } from "./src/utils/logger";
import { createApp } from "./src/app";

import { createCurrencyRepository } from "./src/repository/currencyRepository";
import { createPriceRepository } from "./src/repository/priceRepository";
import { createPriceHistoryRepository } from "./src/repository/priceHistoryRepository";
import { createAddressRepository } from "./src/repository/addressRepository";
import { createBlockchainHeightRepository } from "./src/repository/blockchainHeightRepository";

import { createCurrencyService } from "./src/services/currencyService";
import { createPriceService } from "./src/services/priceService";
import { createBinanceService } from "./src/services/binanceService";
import { createAddressService } from "./src/services/addressService";
import { createBlockchainService } from "./src/services/BlockchainService";

const currencyRepository = createCurrencyRepository(db);
const priceRepository = createPriceRepository(db);
const priceHistoryRepository = createPriceHistoryRepository(db);
const currencyService = createCurrencyService(currencyRepository);
const addressRepository = createAddressRepository(db);
const blockchainRepository = createBlockchainHeightRepository(db);
const blockchainService = createBlockchainService(blockchainRepository, currencyRepository);

const binanceService = createBinanceService();
const priceService = createPriceService(
  currencyRepository,
  priceRepository,
  priceHistoryRepository,
  binanceService
);
const addressService = createAddressService(addressRepository);

const stopScheduler = scheduleService(
  priceService,
  blockchainService,
  config.priceUpdateInterval,
  log
);

const app = createApp(currencyService, priceService, addressService, blockchainService);

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