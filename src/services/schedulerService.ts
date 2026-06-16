import {
  AddressBalanceService,
  AddressService,
  BlockchainService,
  PriceService,
} from "../types";
import { Logger } from "../types/logger";

export function scheduleService(
  priceService: PriceService,
  blockchainService: BlockchainService,
  addressBalanceService: AddressBalanceService,
  addressService: AddressService,
  interval: number,
  logger: Logger
): () => void {
  const timers: NodeJS.Timeout[] = [];
  let stopped = false;

  async function run() {
    if (stopped) return;
    const addresses = addressService.getAll();
    try {
      await priceService.syncPrices();
      await blockchainService.syncHeight();
      for (const address of addresses) {
        try {
          await addressBalanceService.syncAddressBalance(address.address);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unknown error";
          logger.error(`Failed to sync address ${address.address}: ${message}`);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      logger.error(message);
    }

    if (!stopped) {
      const id = setTimeout(run, interval);
      timers.push(id);
    }
  }

  logger.info(`Price updater started, interval: ${interval}ms`);
  run();

  return () => {
    stopped = true;
    timers.forEach(clearTimeout);
    timers.length = 0;
    logger.info("Price updater stopped");
  };
}
