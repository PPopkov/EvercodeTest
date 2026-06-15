import { Price } from "../entities/price";
import { PriceHistory } from "../entities/priceHistory";

export interface PriceService {
  getPricesByTicker: (ticker: string) => Price[];
  getPriceHistory: (ticker: string) => PriceHistory[];
  syncPrices: () => Promise<void>;
}
