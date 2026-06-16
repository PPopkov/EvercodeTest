import { Price } from "..";

export interface PriceRepository {
  getAll(): Price[];
  getById(id: number): Price | undefined;
  getBySymbol(symbol: string): Price[];
  savePrice(symbol: string, price: number, updated_at: string): void;
}
