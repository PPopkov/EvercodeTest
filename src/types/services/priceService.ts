import { Price } from "..";
import { PriceHistory } from "..";

export interface PriceService {
  getPricesByTicker: (ticker: string) => Price[];
  getPriceHistory: (ticker: string) => PriceHistory[];
  syncPrices: () => Promise<void>;
}
