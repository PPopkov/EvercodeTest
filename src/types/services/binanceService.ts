import { BinanceTicker } from "../api/binance";

export interface BinanceService {
  getByTicker: (ticker: string) => Promise<BinanceTicker[]>;
}
