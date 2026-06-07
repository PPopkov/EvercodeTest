const request = require("supertest");
const { DatabaseSync } = require("node:sqlite");
process.env.AUTH_TOKEN = "test-token-123";

const { createApp } = require("../src/app");
const { createCurrencyService } = require("../src/services/currencyService");
const {
  createCurrencyRepository,
} = require("../src/repository/currencyRepository");
let app;
let db;

beforeEach(() => {
  db = new DatabaseSync(":memory:");
  db.exec(
    `CREATE TABLE currencies (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, ticker TEXT NOT NULL UNIQUE)`
  );
  const repository = createCurrencyRepository(db);
  const service = createCurrencyService(repository);
  app = createApp(service, {});
});

test("/GET currency return empty array", async () => {
  const response = await request(app)
    .get("/currency")
    .set("Authorization", "Bearer test-token-123");
  expect(response.status).toBe(200);
});

test("/GET BY ID return undefined", async () => {
  const response = await request(app)
    .get("/currency/999")
    .set("Authorization", "Bearer test-token-123");
  expect(response.status).toBe(404);
});

test("/POST create currency", async () => {
  const response = await request(app)
    .post("/currency")
    .set("Authorization", "Bearer test-token-123")
    .send({ name: "Bitcoin", ticker: "BTC" });
  expect(response.status).toBe(201);
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
  expect(response.status).toBe(409);
});

test("PUT change currency", async () => {
  await request(app)
    .post("/currency")
    .set("Authorization", "Bearer test-token-123")
    .send({ name: "Bitcoin", ticker: "BTC" });

  const response = await request(app)
    .put("/currency/1")
    .set("Authorization", "Bearer test-token-123")
    .send({ name: "TON", ticker: "TN" });

  expect(response.status).toBe(200);
});

test("DELETE remove currency", async () => {
  await request(app)
    .post("/currency")
    .set("Authorization", "Bearer test-token-123")
    .send({ name: "Bitcoin", ticker: "BTC" });

  const response = await request(app)
    .delete("/currency/1")
    .set("Authorization", "Bearer test-token-123");

  expect(response.status).toBe(204);
});
