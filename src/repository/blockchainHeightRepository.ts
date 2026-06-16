import { DatabaseSync } from "node:sqlite";
import { BlockchainHeight, BlockchainHeightRepository } from "../types";

export function createBlockchainHeightRepository(
  db: DatabaseSync
): BlockchainHeightRepository {
  const self: BlockchainHeightRepository = {
    getBySymbol: (symbol: string): BlockchainHeight | undefined => {
      const statement = db.prepare(
        "SELECT * FROM blockchain_height WHERE symbol = ?"
      );
      return statement.get(symbol) as unknown as BlockchainHeight;
    },
    saveHeight: (symbol: string, height: number, updated_at: string): void => {
      const statement = db.prepare(
        "INSERT OR REPLACE INTO blockchain_height (symbol, height, updated_at) VALUES (?, ?, ?)"
      );
      statement.run(symbol, height, updated_at);
    },
  };

  return self;
}
