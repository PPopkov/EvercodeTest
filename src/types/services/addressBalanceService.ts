import { AddressBalance } from "..";

export interface AddressBalanceService {
    getByAddress: (address: string) => AddressBalance | undefined;
    syncAddressBalance: (address: string) => Promise<void>;
}