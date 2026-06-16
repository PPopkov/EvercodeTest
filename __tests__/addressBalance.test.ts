import request from "supertest";
import { DatabaseSync } from "node:sqlite";

process.env.AUTH_TOKEN = "test-token-123";

import { createApp } from "../src/app";
import { createAddressRepository } from "../src/repository/addressRepository";
import { createAddressService } from "../src/services/addressService";
import { createAddressBalanceRepository } from "../src/repository/addressBalanceRepository";
import { createAddressBalanceService } from "../src/services/addressBalanceService";
import { createCurrencyRepository } from "../src/repository/currencyRepository";
import { BlockchainService, CurrencyService, PriceService } from "../src/types";

let app: ReturnType<typeof createApp>;
let db: DatabaseSync;

const BTC_ADDRESS = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";

beforeEach(() => {
  db = new DatabaseSync(":memory:");
  db.exec(
    `CREATE TABLE addresses (id INTEGER PRIMARY KEY AUTOINCREMENT, address TEXT NOT NULL UNIQUE, label TEXT, ticker TEXT NOT NULL)`
  );
  db.exec(
    `CREATE TABLE address_balances (address TEXT PRIMARY KEY, balance REAL NOT NULL, updated_at TEXT NOT NULL)`
  );
  db.exec(
    `CREATE TABLE currencies (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, ticker TEXT NOT NULL UNIQUE, blockchain TEXT NOT NULL)`
  );

  const addressRepository = createAddressRepository(db);
  const currencyRepository = createCurrencyRepository(db);
  const addressBalanceRepository = createAddressBalanceRepository(db);

  const addressService = createAddressService(addressRepository);
  const addressBalanceService = createAddressBalanceService(
    addressBalanceRepository,
    currencyRepository,
    addressRepository
  );

  const mockCurrencyService = {} as CurrencyService;
  const mockPriceService: PriceService = {
    getPricesByTicker: jest.fn().mockReturnValue([]),
    getPriceHistory: jest.fn().mockReturnValue([]),
    syncPrices: jest.fn().mockResolvedValue(undefined),
  };
  const mockBlockchainService: BlockchainService = {
    getHeight: jest.fn(),
    syncHeight: jest.fn().mockResolvedValue(undefined),
  };

  app = createApp(
    mockCurrencyService,
    mockPriceService,
    addressService,
    addressBalanceService,
    mockBlockchainService
  );
});

test("GET /address/:id/balance without token returns 401", async () => {
  const response = await request(app).get("/address/1/balance");
  expect(response.status).toBe(401);
  expect(response.body).toEqual({ error: "No token" });
});

test("GET /address/:id/balance with wrong token returns 403", async () => {
  const response = await request(app)
    .get("/address/1/balance")
    .set("Authorization", "Bearer wrong-token");
  expect(response.status).toBe(403);
  expect(response.body).toEqual({ error: "Access denied" });
});

test("GET /address/:id/balance unknown address returns 404", async () => {
  const response = await request(app)
    .get("/address/1/balance")
    .set("Authorization", "Bearer test-token-123");
  expect(response.status).toBe(404);
  expect(response.body).toEqual({ error: "Address not found" });
});

test("GET /address/:id/balance without balance returns 404", async () => {
  db.prepare(
    "INSERT INTO addresses (address, label, ticker) VALUES (?, ?, ?)"
  ).run(BTC_ADDRESS, "My wallet", "BTC");

  const response = await request(app)
    .get("/address/1/balance")
    .set("Authorization", "Bearer test-token-123");
  expect(response.status).toBe(404);
  expect(response.body).toEqual({ error: "Address balance not found" });
});

test("GET /address/:id/balance returns balance 200", async () => {
  db.prepare(
    "INSERT INTO addresses (address, label, ticker) VALUES (?, ?, ?)"
  ).run(BTC_ADDRESS, "My wallet", "BTC");
  db.prepare(
    "INSERT INTO address_balances (address, balance, updated_at) VALUES (?, ?, ?)"
  ).run(BTC_ADDRESS, 150000000, "2024-01-01T00:00:00.000Z");

  const response = await request(app)
    .get("/address/1/balance")
    .set("Authorization", "Bearer test-token-123");

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    address: BTC_ADDRESS,
    balance: 150000000,
    updated_at: "2024-01-01T00:00:00.000Z",
  });
});
