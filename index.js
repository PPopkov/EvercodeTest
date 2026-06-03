const config = require("./config");
const db = require("./src/database/connection");
const migrate = require("./src/database/migrate");
migrate();
const { scheduleService } = require('./src/services/schedulerService');
const { log } = require("./src/utils/logger");
const { createApp } = require("./src/app");

const { createCurrencyService } = require("./src/services/currencyService");
const {
  createCurrencyRepository
} = require("./src/repository/currencyRepository");
const {createPriceRepository} = require('./src/repository/priceRepository')
const { createPriceService } = require("./src/services/priceService");
const { createBinanceService } = require("./src/services/binanceService");

const currencyRepository = createCurrencyRepository(db);
const priceRepository = createPriceRepository(db);
const currencyService = createCurrencyService(currencyRepository);
const binanceService = createBinanceService();
const priceService = createPriceService(currencyRepository, priceRepository, binanceService);

scheduleService(priceService, 10000, log);

const service = createApp(currencyService, priceService);

service.listen(config.port, () => {
  log.info(`Server search on port: ${config.port} `);
});
