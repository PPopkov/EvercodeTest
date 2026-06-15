import { PriceHistory } from "../entities/priceHistory";

export interface PriceHistoryRepository {
    saveHistory: (symbol: string, price: number, recorded_at: string) => void;
    getHistoryBySymbol: (symbol: string) => PriceHistory[];
}