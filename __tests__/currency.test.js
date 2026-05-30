const request = require("supertest");
process.env.AUTH_TOKEN = "test-token-123";

const { createApp } = require("../src/app");
const { createCurrencyService } = require("../src/services/currencyService");
let app;

beforeEach(() => {
  const currencyService = createCurrencyService();
  app = createApp(currencyService, {});
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

test("DETELE remove currency", async () => {
  await request(app)
    .post("/currency")
    .set("Authorization", "Bearer test-token-123")
    .send({ name: "Bitcoin", ticker: "BTC" });

  const response = await request(app)
    .delete("/currency/1")
    .set("Authorization", "Bearer test-token-123");

  expect(response.status).toBe(204);
});
