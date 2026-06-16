import { Address } from "..";

export interface AddressRepository {
  getAll: () => Address[];
  getById: (id: number) => Address | undefined;
  getByTicker: (ticker: string) => Address | undefined;
  getByAddress: (address: string) => Address | undefined;
  getByLabel: (label: string) => Address | undefined;
  createAddress: (
    address: string,
    label: string | null,
    ticker: string
  ) => Address;
  updateAddress: (id: number, label: string | null, ticker: string) => Address;
  deleteAddress: (id: number) => void;
}
