import Database from 'better-sqlite3';
import { PriceHistoryRepository } from "../types/repositories/priceHistoryRepository";
import { PriceHistory } from "../types/entities/priceHistory";

export function createPriceHistoryRepository(db: Database.Database) {
    const self: PriceHistoryRepository = {
        saveHistory: (symbol: string, price: number, recorded_at: string): void => {
            const statement = db.prepare("INSERT INTO prices_history (symbol, price, recorded_at) VALUES (?, ?, ?)");
            statement.run(symbol, price, recorded_at);
        },
        getHistoryBySymbol: (symbol: string): PriceHistory[] => {
            const statement = db.prepare("SELECT * FROM prices_history WHERE symbol LIKE ? ORDER BY recorded_at DESC");
            return statement.all(`%${symbol}%`) as unknown as PriceHistory[];
        }
    }
    return self;
}