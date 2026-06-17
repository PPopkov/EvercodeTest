import {
  CurrencyRepository,
  PriceHistoryRepository,
  PriceRepository,
} from "../types";
import Database from 'better-sqlite3';
import { BinanceService } from "../types/services/binanceService";
import { PriceService } from "../types/services/priceService";
import { NotFoundError } from "../errors/NotFoundError";
export function createPriceService(
  db: Database.Database,
  currencyRepository: CurrencyRepository,
  priceRepository: PriceRepository,
  priceHistoryRepository: PriceHistoryRepository,
  binanceService: BinanceService,
): PriceService {
  const self = {
    getPricesByTicker: (ticker: string) => {
      if (!currencyRepository.getByTicker(ticker)) {
        throw new NotFoundError("Not Found");
      }
      const prices = priceRepository.getBySymbol(ticker);
      return prices;
    },
    syncPrices: async () => {
      const currencies = currencyRepository.getAll();
      const saveBoth = db.transaction(
        (symbol: string, price: number, updated_at: string) => {
          priceRepository.savePrice(symbol, price, updated_at);
          priceHistoryRepository.saveHistory(symbol, price, updated_at);
        }
      );
      for (const currency of currencies) {
        const routes = await binanceService.getByTicker(currency.ticker);
        for (const route of routes) {
          saveBoth(route.symbol, Number(route.price), new Date().toISOString());
        }
      }
    },
    getPriceHistory: (ticker: string) => {
      if (!currencyRepository.getByTicker(ticker)) {
        throw new NotFoundError("Not Found");
      }
      return priceHistoryRepository.getHistoryBySymbol(ticker);
    },
  };

  return self;
}
