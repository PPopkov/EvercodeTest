import Database from 'better-sqlite3';
import { AddressRepository } from "../types/repositories/addressRepository";
import { Address } from "../types/entities/address";
import { NotFoundError } from "../errors";

export function createAddressRepository(db: Database.Database): AddressRepository {
    const self: AddressRepository = {
        getAll: (): Address[] => {
            const statement = db.prepare("SELECT * FROM addresses");
            return statement.all() as unknown as Address[];
        },
        getById: (id: number): Address | undefined => {
            const statment = db.prepare("SELECT * FROM addresses WHERE id = ?");
            return statment.get(id) as Address | undefined;
        },
        getByTicker: (ticker: string): Address | undefined => {
            const statement = db.prepare("SELECT * FROM addresses WHERE ticker = ?");
            return statement.get(ticker) as Address | undefined;
        },
        getByAddress: (address: string): Address | undefined => {
            const statment = db.prepare("SELECT * FROM addresses WHERE address = ?");
            return statment.get(address) as Address | undefined;
        },
        getByLabel: (label: string) => {
            const statement = db.prepare("SELECT * FROM addresses WHERE label = ?");
            return statement.get(label) as Address | undefined;
        },
        createAddress: (
            address: string,
            label: string | null,
            ticker: string
        ): Address => {
            const statement = db.prepare(
                "INSERT INTO addresses (address, label, ticker) VALUES (?, ?, ?)"
            );
            const id = statement.run(address, label, ticker).lastInsertRowid;
            const add = self.getById(Number(id));

            if (!add) {
                throw new NotFoundError("There is no such address");
            }

            return add;
        },
        updateAddress: (id: number, label: string | null, ticker: string) => {
            const statement = db.prepare(
                "UPDATE addresses SET label = ?, ticker = ? WHERE id = ?"
            );
            const result = statement.run(label, ticker, Number(id));
            if (result.changes === 0) {
                throw new NotFoundError("There is no such address");
            }
            const address = self.getById(Number(id));
            if (!address) {
                throw new NotFoundError("There is no such address");
            }

            return address;
        },
        deleteAddress: (id: number): void => {
            const statement = db.prepare("DELETE FROM addresses WHERE id = ?");
            const result = statement.run(Number(id));
            if (result.changes === 0) {
                throw new NotFoundError("There is no such address");
            }
        },
    };
    return self;
}
