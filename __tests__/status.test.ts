import request from "supertest";

process.env.AUTH_TOKEN = "test-token-123";

import { CurrencyService } from "../src/types/services/currencyService";
import { PriceService } from "../src/types/services/priceService";
import { AddressBalanceService, AddressService, BlockchainService } from "../src/types";
import { createApp } from "../src/app";

let app: ReturnType<typeof createApp>;

const mockCurrencyService = {} as CurrencyService;
const mockPriceService: PriceService = {
  getPricesByTicker: jest.fn().mockReturnValue([]),
  getPriceHistory: jest.fn().mockReturnValue([]),
  syncPrices: jest.fn().mockResolvedValue(undefined),
};

const mockAddressService: AddressService = {
  getAll: jest.fn().mockReturnValue([]),
  getById: jest.fn(),
  getByTicker: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockAddressBalanceService: AddressBalanceService = {
  getByAddress: jest.fn(),
  syncAddressBalance: jest.fn().mockResolvedValue(undefined),
};

const mockBlockchainService: BlockchainService = {
  getHeight: jest.fn(),
  syncHeight: jest.fn().mockResolvedValue(undefined),
};

app = createApp(
  mockCurrencyService,
  mockPriceService,
  mockAddressService,
  mockAddressBalanceService,
  mockBlockchainService
);


test("GET /status return ok", async () => {
  const res = await request(app)
    .get("/status")
    .set("Authorization", "Bearer test-token-123");
  expect(res.status).toBe(200);
  expect(res.text).toBe("ok");
});

test("GET /status without token returns 401", async () => {
  const res = await request(app).get("/status");
  expect(res.status).toBe(401);
  expect(res.body).toEqual({ error: "No token" });
});

test("GET /status wrong token return 403", async () => {
  const res = await request(app)
    .get("/status")
    .set("Authorization", "Bearer wrong-token");
  expect(res.status).toBe(403);
  expect(res.body).toEqual({ error: "Access denied" });
});
