import request from "supertest";
import { DatabaseSync } from "node:sqlite";

process.env.AUTH_TOKEN = "test-token-123";

import { createCurrencyRepository } from "../src/repository/currencyRepository";
import { createCurrencyService } from "../src/services/currencyService";
import { createPriceRepository } from "../src/repository/priceRepository";
import { createPriceService } from "../src/services/priceService";
import { BinanceService } from "../src/types/services/binanceService";
import { createApp } from "../src/app";

let app: ReturnType<typeof createApp>;
let db: DatabaseSync;

beforeEach(() => {
  db = new DatabaseSync(":memory:");

  db.exec(
    `CREATE TABLE currencies (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, ticker TEXT NOT NULL UNIQUE)`
  );

  db.exec(
    `CREATE TABLE prices (id INTEGER PRIMARY KEY AUTOINCREMENT, symbol TEXT NOT NULL UNIQUE, price REAL NOT NULL, updated_at TEXT NOT NULL)`
  );

  const currencyRepository = createCurrencyRepository(db);
  const priceRepository = createPriceRepository(db);
  const currencyService = createCurrencyService(currencyRepository);

  const mockBinanceService: BinanceService = {
    getByTicker: jest.fn().mockResolvedValue([]),
  };

  const priceService = createPriceService(
    currencyRepository,
    priceRepository,
    mockBinanceService
  );

  app = createApp(currencyService, priceService);
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
  db.prepare('INSERT INTO currencies (name, ticker) VALUES (?, ?)').run("Bitcoin", "BTC");
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

