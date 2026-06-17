import request from "supertest";
import Database from 'better-sqlite3';

process.env.AUTH_TOKEN = "test-token-123";

import { createApp } from "../src/app";

import { createCurrencyRepository } from "../src/repository/currencyRepository";
import { createCurrencyService } from "../src/services/currencyService";

import { PriceService } from "../src/types/services/priceService";
import { AddressBalanceService, AddressService, BlockchainService } from "../src/types";

let app: ReturnType<typeof createApp>;
let db: Database.Database;

beforeEach(() => {
  db = new Database(":memory:");
  db.exec(
    `CREATE TABLE currencies (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, ticker TEXT NOT NULL UNIQUE, blockchain TEXT NOT NULL )`
  );
  const repository = createCurrencyRepository(db);
  const service = createCurrencyService(repository);
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
    service,
    mockPriceService,
    mockAddressService,
    mockAddressBalanceService,
    mockBlockchainService
  );
});

test("GET without authorization returns 401", async () => {
  const response = await request(app)
    .get("/currency")
    .send({ name: "Bitcoin", ticker: "BTC" });
  expect(response.body).toEqual({ error: "No token" })
  expect(response.status).toBe(401);
});

test("GET with wrong token returns 403", async () => {
  const response = await request(app)
    .get("/currency")
    .set("Authorization", "Bearer wrong-token");
  expect(response.body).toEqual({ error: "Access denied" })
  expect(response.status).toBe(403);
});

test("/GET currency return empty array 200", async () => {
  const response = await request(app)
    .get("/currency")
    .set("Authorization", "Bearer test-token-123");
  expect(response.body).toEqual([])
  expect(response.status).toBe(200);
});

test("GET /currency/:id return currency 200", async () => {
  await request(app)
    .post("/currency")
    .set("Authorization", "Bearer test-token-123")
    .send({ name: "Bitcoin", ticker: "BTC", blockchain: "bitcoin" });

  const response = await request(app)
    .get("/currency/1")
    .set("Authorization", "Bearer test-token-123");
  expect(response.body).toEqual({ id: 1, name: "Bitcoin", ticker: "BTC", blockchain: "bitcoin" })
  expect(response.status).toBe(200);
})

test("/GET BY ID return undefined currency not found 404", async () => {
  const response = await request(app)
    .get("/currency/999")
    .set("Authorization", "Bearer test-token-123");
  expect(response.body).toEqual({ error: "Currency not found" })
  expect(response.status).toBe(404);
});

test("/POST create currency with correct data returns 201", async () => {
  const response = await request(app)
    .post("/currency")
    .set("Authorization", "Bearer test-token-123")
    .send({ name: "Bitcoin", ticker: "BTC", blockchain: "bitcoin" });
  expect(response.body).toEqual({ id: 1, name: "Bitcoin", ticker: "BTC", blockchain: "bitcoin" })
  expect(response.status).toBe(201);
});

test("/POST create currency with incorrect data returns 400", async () => {
  const response = await request(app)
    .post("/currency")
    .set("Authorization", "Bearer test-token-123")
    .send({ name: "Bitcoin" });
  expect(response.body).toEqual({ error: "The name, ticker and blockchain fields are required" })
  expect(response.status).toBe(400);
});

test("/POST create duplicate ticker returns 409", async () => {
  await request(app)
    .post("/currency")
    .set("Authorization", "Bearer test-token-123")
    .send({ name: "Bitcoin", ticker: "BTC", blockchain: "bitcoin" });


  const response = await request(app)
    .post("/currency")
    .set("Authorization", "Bearer test-token-123")
    .send({ name: "Bitcoin", ticker: "BTC", blockchain: "bitcoin" });
  expect(response.body).toEqual({ error: "The ticker must be unique" })
  expect(response.status).toBe(409);
});

test("PUT change currency 200", async () => {
  await request(app)
    .post("/currency")
    .set("Authorization", "Bearer test-token-123")
    .send({ name: "Bitcoin", ticker: "BTC", blockchain: "bitcoin" });

  const response = await request(app)
    .put("/currency/1")
    .set("Authorization", "Bearer test-token-123")
    .send({ name: "TON", ticker: "TN", blockchain: "ton" });

  expect(response.body).toEqual({ id: 1, name: "TON", ticker: "TN", blockchain: "ton" })
  expect(response.status).toBe(200);
});

test("PUT change undefined currency returns 404", async () => {
  const response = await request(app)
    .put("/currency/999")
    .set("Authorization", "Bearer test-token-123")
    .send({ name: "Bitcoin", ticker: "BTC", blockchain: "bitcoin" });
  expect(response.body).toEqual({ error: "Currency not found" })
  expect(response.status).toBe(404);
});

test("PUT change if ticker is not unique returns 409", async () => {
  await request(app)
    .post("/currency")
    .set("Authorization", "Bearer test-token-123")
    .send({ name: "Bitcoin", ticker: "BTC", blockchain: "bitcoin" });

  await request(app)
    .post("/currency")
    .set("Authorization", "Bearer test-token-123")
    .send({ name: "Ethereum", ticker: "ETH", blockchain: "ethereum" });

  const response = await request(app)
    .put("/currency/2")
    .set("Authorization", "Bearer test-token-123")
    .send({ name: "Bitcoin", ticker: "BTC", blockchain: "bitcoin" });
  expect(response.body).toEqual({ error: "The ticker must be unique" })
  expect(response.status).toBe(409);
});

test("DELETE remove currency 204", async () => {
  await request(app)
    .post("/currency")
    .set("Authorization", "Bearer test-token-123")
    .send({ name: "Bitcoin", ticker: "BTC", blockchain: "bitcoin" });

  const response = await request(app)
    .delete("/currency/1")
    .set("Authorization", "Bearer test-token-123");

  expect(response.status).toBe(204);
});

test("DELETE undefined currency returns 404", async () => {
  const response = await request(app)
    .delete("/currency/999")
    .set("Authorization", "Bearer test-token-123");
  expect(response.body).toEqual({ error: "There is no such currency" })
  expect(response.status).toBe(404);
});


