import { ConflictError, NotFoundError, ValidationError } from "../errors";
import { AddressRepository, AddressService } from "../types";

export function createAddressService(
  repository: AddressRepository
): AddressService {
  return {
    getAll: () => repository.getAll(),
    getById: (id: number) => {
      const address = repository.getById(id);
      if (!address) {
        throw new NotFoundError("Address not found");
      }
      return address;
    },
    getByTicker: (ticker: string) => {
      const address = repository.getByTicker(ticker);
      if (!address) {
        throw new NotFoundError("Address not found");
      }
      return address;
    },
    getByLabel: (label: string) => {
      const address = repository.getByLabel(label);
      if (!address) {
        throw new NotFoundError("Address not found");
      }
      return address;
    },
    create: (address: string, label: string | null, ticker: string) => {
      if (!address || !ticker)
        throw new ValidationError("The address and ticker fields are required");
      if (typeof address !== "string" || typeof ticker !== "string")
        throw new ValidationError(
          "The address and ticker fields must be strings"
        );
      if (label !== null && typeof label !== "string") {
        throw new ValidationError("Label must be a string or null");
      }
      if (repository.getByAddress(address))
        throw new ConflictError("The address must be unique");
      const newAddress = repository.createAddress(address, label, ticker);
      return newAddress;
    },
    update: (id: number, label: string | null, ticker: string) => {
      if (label !== null && typeof label !== "string") {
        throw new ValidationError("Label must be a string or null");
      }
      if (typeof ticker !== "string") {
        throw new ValidationError("Ticker must be a string");
      }
      const address = repository.getById(Number(id));
      if (!address) throw new NotFoundError("Address not found");

      return repository.updateAddress(id, label, ticker);
    },
    delete: (id: number) => {
      repository.deleteAddress(id);
      return true;
    },
  };
}
