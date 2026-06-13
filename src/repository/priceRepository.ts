import { DatabaseSync } from "node:sqlite";
import { Price, PriceRepository } from "../types";

export function createPriceRepository(db: DatabaseSync): PriceRepository {
  const self: PriceRepository = {
    getAll: (): Price[] => {
      const statement = db.prepare("SELECT * FROM prices");
      return statement.all() as unknown as Price[];
    },
    getById: (id: number): Price | undefined => {
      const statement = db.prepare("SELECT * FROM prices WHERE id = ?");
      return statement.get(id) as Price | undefined;
    },
    getBySymbol: (symbol: string): Price[] => {
      const statement = db.prepare("SELECT * FROM prices WHERE symbol LIKE ?");
      return statement.all(`%${symbol}%`) as unknown as Price[];
    },
    savePrice: (symbol: string, price: number, updated_at: string): void => {
      const statement = db.prepare(
        "INSERT OR REPLACE INTO prices (symbol, price, updated_at) VALUES (?, ?, ?)"
      );
      statement.run(symbol, price, updated_at);
    },
  };
  return self;
}

