function scheduleService(
priceService, interval, logger
) {
  logger.info(`Price updater started, interval: ${interval}ms`);
  
  setInterval(async () => {
    priceService.syncPrices();

  }, interval);
}

module.exports = { scheduleService };
