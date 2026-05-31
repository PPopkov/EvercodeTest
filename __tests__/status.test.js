const request = require("supertest");
const { DatabaseSync } = require("node:sqlite");

process.env.AUTH_TOKEN = "test-token-123";
const { createApp } = require("../src/app");

const { createCurrencyService } = require("../src/services/currencyService");
const {
  createCurrencyRepository,
} = require("../src/repository/currencyRepository");
let db = new DatabaseSync(":memory:");
db.exec(
  `CREATE TABLE currencies (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, ticker TEXT NOT NULL UNIQUE)`
);
let currencyRepository = createCurrencyRepository(db);
let app = createApp(createCurrencyService(currencyRepository), {});

test("GET /status return ok", async () => {
  const res = await request(app)
    .get("/status")
    .set("Authorization", "Bearer test-token-123");
  expect(res.status).toBe(200);
  expect(res.text).toBe("ok");
});
