import Database from 'better-sqlite3';
import { AddressBalance, AddressBalanceRepository } from "../types";

export function createAddressBalanceRepository(db: Database.Database): AddressBalanceRepository {
    const self: AddressBalanceRepository = {
        getByAddress: (address: string) => {
            const statement = db.prepare("SELECT * FROM address_balances WHERE address = ?");
            return statement.get(address) as unknown as AddressBalance;
        },
        saveAddressBalance: (address: string, balance: number, updated_at: string) => {
            const statement = db.prepare("INSERT OR REPLACE INTO address_balances (address, balance, updated_at) VALUES (?, ?, ?)");
            statement.run(address, balance, updated_at);
        }
    };
    return self;
}