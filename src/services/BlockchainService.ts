import axios, { isAxiosError } from "axios";
import {
  BlockchainHeight,
  BlockchainHeightRepository,
  BlockchainService,
  BlockchairStats,
  CurrencyRepository,
} from "../types";
import { config } from "../../config";
import { ExternalServiceError, NotFoundError } from "../errors";

export function createBlockchainService(
  repository: BlockchainHeightRepository,
  currencyRepository: CurrencyRepository
): BlockchainService {
  const maxRetries = config.blockchairRetries;
  const timeout = config.blockchairTimeout;
  async function syncHeight(retries = maxRetries): Promise<void> {
    try {
      const currencies = currencyRepository.getAll();
      for (const currency of currencies) {
        const url = `${config.blockchairApiUrl}/${currency.blockchain}/stats`;
        const response = await axios.get<BlockchairStats>(url, {
          timeout: timeout,
        });
        const height = response.data.data.blocks;
        repository.saveHeight(
          currency.ticker,
          height,
          new Date().toISOString()
        );
      }
    } catch (error) {
      if (retries > 0) {
        return syncHeight(retries - 1);
      }
      if (isAxiosError(error) && error.response?.status) {
        throw new ExternalServiceError(
          `Blockchair error: ${error.response.status}`
        );
      }
      throw new ExternalServiceError("Blockchair is unavailable.");
    }
  }

  function getHeight(symbol: string): BlockchainHeight {
    const height = repository.getBySymbol(symbol);
    if (!height) {
      throw new NotFoundError("Blockchain height not found");
    }
    return height;
  }

  return { syncHeight, getHeight };
}
