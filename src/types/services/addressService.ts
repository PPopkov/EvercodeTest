import { Address } from "..";

export interface AddressService {
  getAll: () => Address[];
  getById: (id: number) => Address;
  getByTicker: (ticker: string) => Address;
  getByLabel?: (label: string) => Address;
  create: (address: string, label: string | null, ticker: string) => Address;
  update: (id: number, label: string | null, ticker: string) => Address;
  delete: (id: number) => void;
}
