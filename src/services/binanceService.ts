import axios, { isAxiosError } from "axios";
import { config } from "../../config";
import { BinanceService } from "../types/services/binanceService";
import { BinanceTicker } from "../types";
import { ExternalServiceError } from "../errors/ExternalServiceError";

export function createBinanceService(): BinanceService {
  const maxRetries = config.binanceRetries;
  const timeout = config.binanceTimeout;
  async function getAllPrices(retries = maxRetries) {
    try {
      const response = await axios.get<BinanceTicker[]>(config.binanceApiUrl, {
        timeout: timeout,
      });
      return response.data;
    } catch (error) {
      if (retries > 0) {
        return getAllPrices(retries - 1);
      }
      if (isAxiosError(error) && error.response?.status) {
        throw new ExternalServiceError(
          `Binance error: ${error.response.status}`
        );
      }
      throw new ExternalServiceError("Binance is unavailable.");
    }
  }

  return { getAllPrices };
}
