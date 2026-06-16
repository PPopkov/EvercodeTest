import axios, { isAxiosError } from "axios";
import { config } from "../../config";
import { BinanceService } from "../types/services/binanceService";
import { BinanceTicker } from "../types";
import { ExternalServiceError } from "../errors/ExternalServiceError";

export function createBinanceService(): BinanceService {
  const maxRetries = config.binanceRetries;
  const timeout = config.binanceTimeout;
  async function getByTicker(ticker: string, retries = maxRetries) {
    try {
      const response = await axios.get<BinanceTicker[]>(config.binanceApiUrl, {
        timeout: timeout,
      });
      const allPrice = response.data;
      const filtredPrice = allPrice
        .filter(
          (item) => item.symbol.includes(ticker) && Number(item.price) > 0
        )
        .sort((a, b) => Number(b.price) - Number(a.price));
      return filtredPrice;
    } catch (error) {
      if (retries > 0) {
        return getByTicker(ticker, retries - 1);
      }
      if (isAxiosError(error) && error.response?.status) {
        throw new ExternalServiceError(
          `Binance error: ${error.response.status}`
        );
      }
      throw new ExternalServiceError("Binance is unavailable.");
    }
  }

  return { getByTicker };
}
