import { Logger } from "../src/types/logger";
import { scheduleService } from "../src/services/schedulerService";
import {
  AddressBalanceService,
  AddressService,
  BlockchainService,
  PriceService,
} from "../src/types";

jest.useFakeTimers();

beforeEach(() => {
  jest.clearAllMocks();
});

const mockLog: Logger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
};

const syncPrices = jest.fn().mockResolvedValue(undefined);
const syncHeight = jest.fn().mockResolvedValue(undefined);
const syncAddressBalance = jest.fn().mockResolvedValue(undefined);
const getAll = jest.fn().mockReturnValue([]);

const mockPriceService: PriceService = {
  getPricesByTicker: jest.fn().mockReturnValue([]),
  getPriceHistory: jest.fn().mockReturnValue([]),
  syncPrices,
};

const mockBlockchainService: BlockchainService = {
  getHeight: jest.fn(),
  syncHeight,
};

const mockAddressBalanceService: AddressBalanceService = {
  getByAddress: jest.fn(),
  syncAddressBalance,
};

const mockAddressService: AddressService = {
  getAll,
  getById: jest.fn(),
  getByTicker: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

function startScheduler() {
  return scheduleService(
    mockPriceService,
    mockBlockchainService,
    mockAddressBalanceService,
    mockAddressService,
    1000,
    mockLog
  );
}

async function flushSchedulerRun() {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

test("syncPrices is called", async () => {
  const stop = startScheduler();
  await flushSchedulerRun();
  expect(syncPrices).toHaveBeenCalled();
  stop();
});

test("syncHeight is called", async () => {
  const stop = startScheduler();
  await flushSchedulerRun();
  expect(syncHeight).toHaveBeenCalled();
  stop();
});

test("syncAddressBalance is called for each address", async () => {
  getAll.mockReturnValue([
    {
      id: 1,
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      label: null,
      ticker: "BTC",
    },
    {
      id: 2,
      address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      label: null,
      ticker: "BTC",
    },
  ]);

  const stop = startScheduler();
  await flushSchedulerRun();

  expect(syncAddressBalance).toHaveBeenCalledTimes(2);
  expect(syncAddressBalance).toHaveBeenCalledWith(
    "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
  );
  expect(syncAddressBalance).toHaveBeenCalledWith(
    "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
  );
  stop();
});
