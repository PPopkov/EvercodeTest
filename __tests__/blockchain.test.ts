import request from "supertest";
import Database from 'better-sqlite3';

process.env.AUTH_TOKEN = "test-token-123";

import { createApp } from "../src/app";
import { createCurrencyRepository } from "../src/repository/currencyRepository";
import { createBlockchainHeightRepository } from "../src/repository/blockchainHeightRepository";
import { createBlockchainService } from "../src/services/BlockchainService";
import { AddressBalanceService, AddressService, CurrencyService, PriceService } from "../src/types";

let app: ReturnType<typeof createApp>;
let db: Database.Database;

beforeEach(() => {
  db = new Database(":memory:");
  db.exec(
    `CREATE TABLE currencies (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, ticker TEXT NOT NULL UNIQUE, blockchain TEXT NOT NULL)`
  );
  db.exec(
    `CREATE TABLE blockchain_height (id INTEGER PRIMARY KEY AUTOINCREMENT, symbol TEXT NOT NULL UNIQUE, height INTEGER NOT NULL, updated_at TEXT NOT NULL)`
  );

  const currencyRepository = createCurrencyRepository(db);
  const blockchainRepository = createBlockchainHeightRepository(db);
  const blockchainService = createBlockchainService(
    blockchainRepository,
    currencyRepository
  );

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

  app = createApp(
    mockCurrencyService,
    mockPriceService,
    mockAddressService,
    mockAddressBalanceService,
    blockchainService
  );
});

test("GET /blockchain without token returns 401", async () => {
  const response = await request(app).get("/blockchain?currency=BTC");
  expect(response.status).toBe(401);
  expect(response.body).toEqual({ error: "No token" });
});

test("GET /blockchain with wrong token returns 403", async () => {
  const response = await request(app)
    .get("/blockchain?currency=BTC")
    .set("Authorization", "Bearer wrong-token");
  expect(response.status).toBe(403);
  expect(response.body).toEqual({ error: "Access denied" });
});

test("GET /blockchain without currency returns 400", async () => {
  const response = await request(app)
    .get("/blockchain")
    .set("Authorization", "Bearer test-token-123");
  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    error: "Currency query parameter is required",
  });
});

test("GET /blockchain unknown currency returns 404", async () => {
  const response = await request(app)
    .get("/blockchain?currency=BTC")
    .set("Authorization", "Bearer test-token-123");
  expect(response.status).toBe(404);
  expect(response.body).toEqual({ error: "Blockchain height not found" });
});

test("GET /blockchain returns height 200", async () => {
  db.prepare(
    "INSERT INTO blockchain_height (symbol, height, updated_at) VALUES (?, ?, ?)"
  ).run("BTC", 800000, "2024-01-01T00:00:00.000Z");

  const response = await request(app)
    .get("/blockchain?currency=BTC")
    .set("Authorization", "Bearer test-token-123");

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    id: 1,
    symbol: "BTC",
    height: 800000,
    updated_at: "2024-01-01T00:00:00.000Z",
  });
});
