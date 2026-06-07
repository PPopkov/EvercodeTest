const { NotFoundError } = require("../errors/NotFoundError");

function createPriceService(currencyRepository, priceRepository, binanceService) {
  const self = {
    getPricesByTicker: (ticker) => {
      if (!currencyRepository.getByTicker(ticker)) {
        throw new NotFoundError("Not Found");
      }
      const prices = priceRepository.getBySymbol(ticker);
      return prices;
    },
    syncPrices: async() => {
      const currencies = currencyRepository.getAll();
      for (const currency of currencies) {
        const routes =  await binanceService.getByTicker(currency.ticker);
        for (const route of routes) {
          priceRepository.savePrice(
            route.symbol,
            route.price,
            new Date().toISOString()
          );
        }
      }

    }
  };

  return self;
}

module.exports = {
  createPriceService,
};
