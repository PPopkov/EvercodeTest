import { AddressBalance } from "..";

export interface AddressBalanceRepository {
    getByAddress: (address: string) => AddressBalance | undefined;
    saveAddressBalance: (address: string, balance: number, updated_at: string) => void;
}