import { CurrencyRepository, PriceRepository } from "../types";
import { BinanceService } from "../types/services/binanceService";
import { PriceService } from "../types/services/priceService";
import { NotFoundError } from "../errors/NotFoundError";

export function createPriceService(currencyRepository: CurrencyRepository, priceRepository: PriceRepository, binanceService: BinanceService): PriceService {
  const self = {
    getPricesByTicker: (ticker: string) => {
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
            Number(route.price),
            new Date().toISOString()
          );
        }
      }

    }
  };

  return self;
}

