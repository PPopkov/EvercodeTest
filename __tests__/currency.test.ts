import request from "supertest";
import { DatabaseSync } from "node:sqlite";

process.env.AUTH_TOKEN = "test-token-123";

import { createApp } from "../src/app";
import { createCurrencyService } from "../src/services/currencyService";
import { createCurrencyRepository } from "../src/repository/currencyRepository";
import { PriceService } from "../src/types/services/priceService";

let app: ReturnType<typeof createApp>;
let db: DatabaseSync;

beforeEach(() => {
  db = new DatabaseSync(":memory:");
  db.exec(
    `CREATE TABLE currencies (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, ticker TEXT NOT NULL UNIQUE)`
  );
  const repository = createCurrencyRepository(db);
  const service = createCurrencyService(repository);
  const mockPriceService: PriceService = {
    getPricesByTicker: jest.fn().mockReturnValue([]),
    syncPrices: jest.fn().mockResolvedValue(undefined),
  };
  app = createApp(service, mockPriceService);
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
    .send({ name: "Bitcoin", ticker: "BTC" });

  const response = await request(app)
    .get("/currency/1")
    .set("Authorization", "Bearer test-token-123");
  expect(response.body).toEqual({ id: 1, name: "Bitcoin", ticker: "BTC" })
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
    .send({ name: "Bitcoin", ticker: "BTC" });
  expect(response.body).toEqual({ id: 1, name: "Bitcoin", ticker: "BTC" })
  expect(response.status).toBe(201);
});

test("/POST create currency with incorrect data returns 400", async () => {
  const response = await request(app)
    .post("/currency")
    .set("Authorization", "Bearer test-token-123")
    .send({ name: "Bitcoin" });
  expect(response.body).toEqual({ error: "The name and ticker fields are required" })
  expect(response.status).toBe(400);
});

test("/POST create duplicate ticker returns 409", async () => {
  await request(app)
    .post("/currency")
    .set("Authorization", "Bearer test-token-123")
    .send({ name: "Bitcoin", ticker: "BTC" });


  const response = await request(app)
    .post("/currency")
    .set("Authorization", "Bearer test-token-123")
    .send({ name: "Bitcoin", ticker: "BTC" });
  expect(response.body).toEqual({ error: "The ticker must be unique" })
  expect(response.status).toBe(409);
});

test("PUT change currency 200", async () => {
  await request(app)
    .post("/currency")
    .set("Authorization", "Bearer test-token-123")
    .send({ name: "Bitcoin", ticker: "BTC" });

  const response = await request(app)
    .put("/currency/1")
    .set("Authorization", "Bearer test-token-123")
    .send({ name: "TON", ticker: "TN" });

  expect(response.body).toEqual({ id: 1, name: "TON", ticker: "TN" })
  expect(response.status).toBe(200);
});

test("PUT change undefined currency returns 404", async () => {
  const response = await request(app)
    .put("/currency/999")
    .set("Authorization", "Bearer test-token-123")
    .send({ name: "Bitcoin", ticker: "BTC" });
  expect(response.body).toEqual({ error: "Currency not found" })
  expect(response.status).toBe(404);
});

test("DELETE remove currency 204", async () => {
  await request(app)
    .post("/currency")
    .set("Authorization", "Bearer test-token-123")
    .send({ name: "Bitcoin", ticker: "BTC" });

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


