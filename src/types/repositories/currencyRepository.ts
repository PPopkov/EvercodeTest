import { Currency } from "..";

export interface CurrencyRepository {
    getAll(): Currency[];
    getById(id: number): Currency | undefined;
    getByTicker(ticker: string): Currency | undefined;
    createCurrency(name: string, ticker: string, blockchain: string): Currency;
    updateCurrency(id: number, name: string, ticker: string, blockchain: string): Currency;
    deleteCurrency(id: number): void;
}