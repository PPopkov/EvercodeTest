/// <reference types="jest" />
import request from "supertest";
import { DatabaseSync } from "node:sqlite";

process.env.AUTH_TOKEN = "test-token-123";

import { CurrencyService } from "../src/types/services/currencyService";
import { PriceService } from "../src/types/services/priceService";
import { createApp } from "../src/app";

let app: ReturnType<typeof createApp>;

const mockCurrencyService = {} as CurrencyService;
const mockPriceService: PriceService = {
  getPricesByTicker: jest.fn().mockReturnValue([]),
  syncPrices: jest.fn().mockResolvedValue(undefined),
};

app = createApp(mockCurrencyService, mockPriceService);


test("GET /status return ok", async () => {
  const res = await request(app)
    .get("/status")
    .set("Authorization", "Bearer test-token-123");
  expect(res.status).toBe(200);
  expect(res.text).toBe("ok");
});

test("GET /status without token returns 401", async () => {
  const res = await request(app).get("/status");
  expect(res.status).toBe(401);
  expect(res.body).toEqual({ error: "No token" });
});

test("GET /status wrong token return 403", async () => {
  const res = await request(app)
    .get("/status")
    .set("Authorization", "Bearer wrong-token");
  expect(res.status).toBe(403);
  expect(res.body).toEqual({ error: "Access denied" });
});
