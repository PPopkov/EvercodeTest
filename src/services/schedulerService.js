function scheduleService(priceService, interval, logger) {
  const timers = [];
  let stopped = false;

  async function run() {
    if (stopped) return;
    try {
      await priceService.syncPrices();
    } catch (error) {
      logger.error(error.message);
    }

    if (!stopped) {
      const id = setTimeout(run, interval);
      timers.push(id);
    }
  }

  logger.info(`Price updater started, interval: ${interval}ms`);
  run();

  return () => {
    stopped = true;
    timers.forEach(clearTimeout);
    timers.length = 0;
    logger.info("Price updater stopped");
  };
}

module.exports = { scheduleService };
