import { BinanceTicker } from "..";

export interface BinanceService {
  getByTicker: (ticker: string) => Promise<BinanceTicker[]>;
}
