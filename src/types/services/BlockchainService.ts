import { BlockchainHeight } from "..";

export interface BlockchainService {
    getHeight: (symbol: string) => BlockchainHeight;
    syncHeight: () => Promise<void>;
}