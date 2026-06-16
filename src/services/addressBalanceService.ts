import axios, { isAxiosError } from "axios";
import { ExternalServiceError, NotFoundError } from "../errors";
import {
  AddressBalanceRepository,
  AddressBalanceService,
  AddressRepository,
  CurrencyRepository,
} from "../types";
import { config } from "../../config";

export function createAddressBalanceService(
  addressBalanceRepository: AddressBalanceRepository,
  currencyRepository: CurrencyRepository,
  addressRepository: AddressRepository
): AddressBalanceService {
  function getByAddress(address: string) {
    const balance = addressBalanceRepository.getByAddress(address);
    if (balance === undefined) {
      throw new NotFoundError("Address balance not found");
    }
    return balance;
  }
  async function syncAddressBalance(
    address: string,
    retries = config.blockchairRetries
  ) {
    const blockchainApiUrl = config.blockchairApiUrl;
    const addr = addressRepository.getByAddress(address);
    if (!addr) throw new NotFoundError("Address not found");

    const currency = currencyRepository.getByTicker(addr.ticker);
    if (!currency) throw new NotFoundError("Currency not found");
    try {
      const url = `${blockchainApiUrl}/${currency.blockchain}/dashboards/address/${addr.address}`;
      const response = await axios.get(url, {
        timeout: config.blockchairTimeout,
      });
      const balance = response.data.data[addr.address]?.address?.balance;

      if (balance === undefined) {
        throw new NotFoundError("Address balance not found");
      }

      addressBalanceRepository.saveAddressBalance(
        addr.address,
        balance,
        new Date().toISOString()
      );
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      if (retries > 0) {
        return syncAddressBalance(address, retries - 1);
      }
      if (isAxiosError(error) && error.response?.status) {
        throw new ExternalServiceError(
          `Blockchair error: ${error.response.status}`
        );
      }
      throw new ExternalServiceError("Blockchair is unavailable.");
    }
  }

  return { getByAddress, syncAddressBalance };
}
