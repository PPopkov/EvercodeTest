import { Price } from "../entities/price";

export interface PriceService {
  getPricesByTicker: (ticker: string) => Price[];
  syncPrices: () => Promise<void>;
}
