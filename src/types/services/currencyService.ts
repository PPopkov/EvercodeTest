import { Currency } from "..";

export interface CurrencyService {
  getAll: () => Currency[];
  getById: (id: number) => Currency;
  getByTicker: (ticker: string) => Currency;
  create: (name: string, ticker: string, blockchain: string) => Currency;
  update: (id: number, name: string, ticker: string, blockchain: string) => Currency;
  remove: (id: number) => void;
}
