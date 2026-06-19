import { BinanceTicker } from "..";

export interface BinanceService {
  getAllPrices: (retries?: number) => Promise<BinanceTicker[]>;
}
