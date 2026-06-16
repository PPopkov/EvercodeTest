import { DatabaseSync } from "node:sqlite";
import { NotFoundError } from "../errors/NotFoundError";
import { Currency, CurrencyRepository } from "../types";

export function createCurrencyRepository(db: DatabaseSync): CurrencyRepository {
  const self: CurrencyRepository = {
    getAll: (): Currency[] => {
      const statement = db.prepare("SELECT * FROM currencies");
      const currencies = statement.all() as unknown as Currency[];
      return currencies;
    },
    getById: (id: number): Currency | undefined => {
      const statement = db.prepare("SELECT * FROM currencies WHERE id = ?");
      return statement.get(id) as Currency | undefined;
    },
    getByTicker: (ticker: string): Currency | undefined => {
      const statement = db.prepare("SELECT * FROM currencies WHERE ticker = ?");
      return statement.get(ticker) as Currency | undefined;
    },
    createCurrency: (name: string, ticker: string, blockchain: string): Currency => {
      const statement = db.prepare(
        "INSERT INTO currencies (name, ticker, blockchain) VALUES (?, ?, ?)"
      );
      const id = statement.run(name, ticker, blockchain).lastInsertRowid;
      const currency = self.getById(Number(id));

      if (!currency) {
        throw new NotFoundError("There is no such currency");
      }

      return currency;
    },
    updateCurrency: (id: number, name: string, ticker: string, blockchain: string): Currency => {
      const statement = db.prepare(
        "UPDATE currencies SET name = ?, ticker = ?, blockchain = ? WHERE id = ?"
      );
      const result = statement.run(name, ticker, blockchain, Number(id));
      if (result.changes === 0) {
        throw new NotFoundError("There is no such currency");
      }
      const currency = self.getById(Number(id));
      if (!currency) {
        throw new NotFoundError("There is no such currency");
      }
      return currency;
    },
    deleteCurrency: (id: number): void => {
      const statement = db.prepare("DELETE FROM currencies WHERE id = ?");
      const result = statement.run(id);
      if (result.changes === 0) {
        throw new NotFoundError("There is no such currency");
      }
    },
  };
  return self;
}
