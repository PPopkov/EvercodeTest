import { BlockchainHeight } from "..";

export interface BlockchainHeightRepository {
    getBySymbol: (symbol: string) => BlockchainHeight | undefined;
    saveHeight: (symbol: string, height: number, updated_at: string) => void;
}