import { CurrencyService } from "../types/services/currencyService";
import { CurrencyRepository } from "../types";
import { ConflictError } from "../errors/ConflictError";
import { NotFoundError } from "../errors/NotFoundError";
import { ValidationError } from "../errors/ValidationError";

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
    create: (name: string, ticker: string) => {
      if (!name || !ticker)
        throw new ValidationError("The name and ticker fields are required");
      if (typeof name !== "string" || typeof ticker !== "string")
        throw new ValidationError(
          "The name and ticker fields must be strings."
        );
      if(repository.getByTicker(ticker)) {
        throw new ConflictError("The ticker must be unique");
      }
      const newCurrency = repository.createCurrency(name, ticker);
      return newCurrency;
    },
    update: (id: number, name: string, ticker: string) => {
      if (typeof name !== "string" || typeof ticker !== "string")
        throw new ValidationError(
      "The name and ticker fields must be strings."
    );
    const currency = repository.getById(id);
    if (!currency) throw new NotFoundError("Currency not found");
    return repository.updateCurrency(id, name, ticker);
    },
    remove: (id: number) => {
      repository.deleteCurrency(id);  
      return true;
    },
  };
}
