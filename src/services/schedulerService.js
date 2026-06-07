function scheduleService(priceService, interval, logger) {
  async function run() {
    try {
      await priceService.syncPrices();
    } catch (error) {
      logger.error(error.message);
    }
    setTimeout(run, interval);
  }

  logger.info(`Price updater started, interval: ${interval}ms`);
  run();
}

module.exports = { scheduleService };
