import { Logger } from "../src/types/logger";
import { scheduleService } from "../src/services/schedulerService";
import { BlockchainService, PriceService } from "../src/types";

jest.useFakeTimers();

beforeEach(() => {
  jest.clearAllMocks();
});

const mockLog: Logger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn()
}

const syncPrices = jest.fn().mockResolvedValue(undefined);
const syncHeight = jest.fn().mockResolvedValue(undefined);

const mockPriceService: PriceService = {
  getPricesByTicker: jest.fn().mockReturnValue([]),
  getPriceHistory: jest.fn().mockReturnValue([]),
  syncPrices,
};

const mockBlockchainService: BlockchainService = {
  getHeight: jest.fn(),
  syncHeight,
};

test("syncPrices is called", async () => {
  const stop = scheduleService(mockPriceService, mockBlockchainService, 1000, mockLog);
  await Promise.resolve();
  expect(syncPrices).toHaveBeenCalled();
  stop();
});

test("syncHeight is called", async () => {
  const stop = scheduleService(mockPriceService, mockBlockchainService, 1000, mockLog);
  await Promise.resolve();
  expect(syncHeight).toHaveBeenCalled();
  stop();
});
