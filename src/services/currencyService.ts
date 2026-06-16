import { CurrencyService } from "../types/";
import { CurrencyRepository } from "../types";
import { ConflictError } from "../errors/";
import { NotFoundError } from "../errors/";
import { ValidationError } from "../errors/";

export function createCurrencyService(repository: CurrencyRepository): CurrencyService {
  return {
    getAll: () => repository.getAll(),
    getById: (id: number) => {
      const currency = repository.getById(id);
      if (!currency) throw new NotFoundError("Currency not found");
      return currency;
    },
    getByTicker: (ticker: string) => {
      const currency = repository.getByTicker(ticker);
      if (!currency) throw new NotFoundError("Currency not found");
      return currency;
    },
    create: (name: string, ticker: string, blockchain: string) => {
      if (!name || !ticker || !blockchain)
        throw new ValidationError("The name, ticker and blockchain fields are required");
      if (typeof name !== "string" || typeof ticker !== "string" || typeof blockchain !== "string")
        throw new ValidationError(
          "The name and ticker fields must be strings."
        );
      if (repository.getByTicker(ticker)) {
        throw new ConflictError("The ticker must be unique");
      }
      const newCurrency = repository.createCurrency(name, ticker, blockchain);
      return newCurrency;
    },
    update: (id: number, name: string, ticker: string, blockchain: string) => {
      if (typeof name !== "string" || typeof ticker !== "string" || typeof blockchain !== "string")
        throw new ValidationError(
          "The name and ticker fields must be strings."
        );
      const currency = repository.getById(id);
      if (!currency) throw new NotFoundError("Currency not found");

      const existing = repository.getByTicker(ticker);
      if (existing && existing.id !== id) {
        throw new ConflictError("The ticker must be unique");
      }

      return repository.updateCurrency(id, name, ticker, blockchain);
    },
    remove: (id: number) => {
      repository.deleteCurrency(id);
      return true;
    },
  };
}
