const config = require("./config");
const { log } = require("./src/logger");
const { createApp } = require("./src/app");
const {createCurrencyService} = require('./src/services/currencyService')
const { createBinanceService } = require('./src/services/binanceService')
const currencyService = createCurrencyService();
const binanceService = createBinanceService()

const service = createApp(currencyService, binanceService);

service.listen(config.port, () => {
  log.info(`Server search on port: ${config.port} `);
});
