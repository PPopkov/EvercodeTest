import { Logger } from "../src/types/logger";
import { scheduleService } from "../src/services/schedulerService";
import { PriceService } from "../src/types/services/priceService";

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

const mockPriceService: PriceService = {
  getPricesByTicker: jest.fn().mockReturnValue([]),
  getPriceHistory: jest.fn().mockReturnValue([]),
  syncPrices
};

test("syncPrices is called", () => {
  const stop = scheduleService(mockPriceService, 1000, mockLog);
  jest.advanceTimersByTime(1000);
  expect(syncPrices).toHaveBeenCalled();
  stop();
});
