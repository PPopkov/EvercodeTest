const request = require("supertest");
const { DatabaseSync } = require("node:sqlite");
process.env.AUTH_TOKEN = "test-token-123";

const { createApp } = require("../src/app");
const { createCurrencyService } = require("../src/services/currencyService");
const {
  createCurrencyRepository,
} = require("../src/repository/currencyRepository");
const { createPriceRepository } = require("../src/repository/priceRepository");
const { createPriceService } = require("../src/services/priceService");
let app;
let db;

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
  const priceService = createPriceService(
    currencyRepository,
    priceRepository,
    {}
  );
  app = createApp(currencyService, priceService);
});

test("/GET BY SYMBOL return undefined", async () => {
  const response = await request(app)
    .get("/price?currency=XXX")
    .set("Authorization", "Bearer test-token-123");
  expect(response.status).toBe(404);
});

test("/GET CURRENCY'S PRICE", async () => {
    db.prepare('INSERT INTO currencies (name, ticker) VALUES (?, ?)').run("Bitcoin", "BTC");
    db.prepare('INSERT INTO prices (symbol, price, updated_at) VALUES (?, ?, ?)').run("BTC", 5000, new Date().toISOString());
    const response = await request(app).get("/price?currency=BTC").set("Authorization", "Bearer test-token-123");
    expect(response.status).toBe(200);
})
