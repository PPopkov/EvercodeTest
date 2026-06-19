import request from "supertest";
import Database from 'better-sqlite3';

process.env.AUTH_TOKEN = "test-token-123";

import { createCurrencyRepository } from "../src/repository/currencyRepository";
import { createCurrencyService } from "../src/services/currencyService";
import { createPriceRepository } from "../src/repository/priceRepository";
import { createPriceHistoryRepository } from "../src/repository/priceHistoryRepository";
import { createPriceService } from "../src/services/priceService";
import { BinanceService } from "../src/types/services/binanceService";
import { AddressBalanceService, AddressService, BlockchainService } from "../src/types";
import { createApp } from "../src/app";

let app: ReturnType<typeof createApp>;
let db: Database.Database;

beforeEach(() => {
  db = new Database(":memory:");

  db.exec(
    `CREATE TABLE currencies (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, ticker TEXT NOT NULL UNIQUE, blockchain TEXT NOT NULL)`
  );

  db.exec(
    `CREATE TABLE prices (id INTEGER PRIMARY KEY AUTOINCREMENT, symbol TEXT NOT NULL UNIQUE, price REAL NOT NULL, updated_at TEXT NOT NULL)`
  );

  db.exec(
    `CREATE TABLE prices_history (id INTEGER PRIMARY KEY AUTOINCREMENT, symbol TEXT NOT NULL, price REAL NOT NULL, recorded_at TEXT NOT NULL)`
  );

  const currencyRepository = createCurrencyRepository(db);
  const priceRepository = createPriceRepository(db);
  const priceHistoryRepository = createPriceHistoryRepository(db);
  const currencyService = createCurrencyService(currencyRepository);

  const mockBinanceService: BinanceService = {
    getAllPrices: jest.fn().mockResolvedValue([]),
  };

  const priceService = createPriceService(
    db,
    currencyRepository,
    priceRepository,
    priceHistoryRepository,
    mockBinanceService
  );

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
    currencyService,
    priceService,
    mockAddressService,
    mockAddressBalanceService,
    mockBlockchainService
  );
});

test("/GET without current token return 401", async () => {
  const response = await request(app).get("/price?currency=BTC");
  expect(response.status).toBe(401);
  expect(response.body).toEqual({ error: "No token" });
});

test("/GET with wrong token return 403", async () => {
  const response = await request(app).get("/price?currency=BTC").set("Authorization", "Bearer wrong-token");
  expect(response.status).toBe(403);
  expect(response.body).toEqual({ error: "Access denied" });
})

test("/GET currency's price return 200", async () => {
  db.prepare('INSERT INTO currencies (name, ticker, blockchain) VALUES (?, ?, ?)').run("Bitcoin", "BTC", "bitcoin");
  db.prepare('INSERT INTO prices (symbol, price, updated_at) VALUES (?, ?, ?)').run("BTC", 5000, "2024-01-01T00:00:00.000Z");
  const response = await request(app).get("/price?currency=BTC").set("Authorization", "Bearer test-token-123");
  expect(response.status).toBe(200);
  expect(response.body).toEqual([{
    id: 1,
    symbol: "BTC",
    price: 5000,
    updated_at: "2024-01-01T00:00:00.000Z",
  }])
})

test("/GET wrong currency return 404", async () => {
  const response = await request(app)
    .get("/price?currency=XXX")
    .set("Authorization", "Bearer test-token-123");
  expect(response.status).toBe(404);
  expect(response.body).toEqual({ error: "Not Found" });
});

test("GET /price without currency returns 400", async () => {
  const response = await request(app)
    .get("/price")
    .set("Authorization", "Bearer test-token-123");
  expect(response.status).toBe(400);
  expect(response.body).toEqual({ error: "Currency query parameter is required" });
});

test("/GET price history without current token return 401", async () => {
  const response = await request(app).get("/price/history?currency=BTC");
  expect(response.status).toBe(401);
  expect(response.body).toEqual({ error: "No token" });
});

test("/GET price history with wrong token return 403", async () => {
  const response = await request(app).get("/price/history?currency=BTC").set("Authorization", "Bearer wrong-token");
  expect(response.status).toBe(403);
  expect(response.body).toEqual({ error: "Access denied" });
})

test("/GET price history return 200", async () => {
  db.prepare('INSERT INTO currencies (name, ticker, blockchain) VALUES (?, ?, ?)').run("Bitcoin", "BTC", "bitcoin");
  db.prepare('INSERT INTO prices_history (symbol, price, recorded_at) VALUES (?, ?, ?)').run("BTC", 5000, "2024-01-01T00:00:00.000Z");
  const response = await request(app).get("/price/history?currency=BTC").set("Authorization", "Bearer test-token-123");
  expect(response.status).toBe(200);
  expect(response.body).toEqual([{
    id: 1,
    symbol: "BTC",
    price: 5000,
    recorded_at: "2024-01-01T00:00:00.000Z",
  }])
})

test("/GET price history wrong currency return 404", async () => {
  const response = await request(app)
    .get("/price/history?currency=XXX")
    .set("Authorization", "Bearer test-token-123");
  expect(response.status).toBe(404);
  expect(response.body).toEqual({ error: "Not Found" });
})

test("GET /price/history without currency returns 400", async () => {
  const response = await request(app)
    .get("/price/history")
    .set("Authorization", "Bearer test-token-123")
  expect(response.status).toBe(400)
  expect(response.body).toEqual({ error: "Currency query parameter is required" });
});