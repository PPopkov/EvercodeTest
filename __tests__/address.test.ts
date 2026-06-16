import request from "supertest";
import { DatabaseSync } from "node:sqlite";

process.env.AUTH_TOKEN = "test-token-123";

import { createApp } from "../src/app";
import { createAddressRepository } from "../src/repository/addressRepository";
import { createAddressService } from "../src/services/addressService";
import { CurrencyService } from "../src/types/services/currencyService";
import { PriceService } from "../src/types/services/priceService";
import { BlockchainService } from "../src/types";

let app: ReturnType<typeof createApp>;
let db: DatabaseSync;

const BTC_ADDRESS = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";
const ETH_ADDRESS = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";

beforeEach(() => {
    db = new DatabaseSync(":memory:");
    db.exec(
        `CREATE TABLE addresses (id INTEGER PRIMARY KEY AUTOINCREMENT, address TEXT NOT NULL UNIQUE, label TEXT, ticker TEXT NOT NULL)`
    );

    const repository = createAddressRepository(db);
    const addressService = createAddressService(repository);

    const mockCurrencyService = {} as CurrencyService;
    const mockPriceService: PriceService = {
        getPricesByTicker: jest.fn().mockReturnValue([]),
        getPriceHistory: jest.fn().mockReturnValue([]),
        syncPrices: jest.fn().mockResolvedValue(undefined),
    };
    const mockBlockchainService: BlockchainService = {
        getHeight: jest.fn(),
        syncHeight: jest.fn().mockResolvedValue(undefined),
    };
    app = createApp(mockCurrencyService, mockPriceService, addressService, mockBlockchainService);
});

test("GET without authorization returns 401", async () => {
    const response = await request(app).get("/address");
    expect(response.body).toEqual({ error: "No token" });
    expect(response.status).toBe(401);
});

test("GET with wrong token returns 403", async () => {
    const response = await request(app)
        .get("/address")
        .set("Authorization", "Bearer wrong-token");
    expect(response.body).toEqual({ error: "Access denied" });
    expect(response.status).toBe(403);
});

test("/GET address return empty array 200", async () => {
    const response = await request(app)
        .get("/address")
        .set("Authorization", "Bearer test-token-123");
    expect(response.body).toEqual([]);
    expect(response.status).toBe(200);
});

test("GET /address/:id return address 200", async () => {
    await request(app)
        .post("/address")
        .set("Authorization", "Bearer test-token-123")
        .send({ address: BTC_ADDRESS, label: "My wallet", ticker: "BTC" });

    const response = await request(app)
        .get("/address/1")
        .set("Authorization", "Bearer test-token-123");
    expect(response.body).toEqual({
        id: 1,
        address: BTC_ADDRESS,
        label: "My wallet",
        ticker: "BTC",
    });
    expect(response.status).toBe(200);
});

test("/GET BY ID return undefined address not found 404", async () => {
    const response = await request(app)
        .get("/address/999")
        .set("Authorization", "Bearer test-token-123");
    expect(response.body).toEqual({ error: "Address not found" });
    expect(response.status).toBe(404);
});

test("/POST create address with correct data returns 201", async () => {
    const response = await request(app)
        .post("/address")
        .set("Authorization", "Bearer test-token-123")
        .send({ address: BTC_ADDRESS, label: "My wallet", ticker: "BTC" });
    expect(response.body).toEqual({
        id: 1,
        address: BTC_ADDRESS,
        label: "My wallet",
        ticker: "BTC",
    });
    expect(response.status).toBe(201);
});

test("/POST create address with incorrect data returns 400", async () => {
    const response = await request(app)
        .post("/address")
        .set("Authorization", "Bearer test-token-123")
        .send({ address: BTC_ADDRESS });
    expect(response.body).toEqual({
        error: "The address and ticker fields are required",
    });
    expect(response.status).toBe(400);
});

test("/POST create duplicate address returns 409", async () => {
    await request(app)
        .post("/address")
        .set("Authorization", "Bearer test-token-123")
        .send({ address: BTC_ADDRESS, label: "My wallet", ticker: "BTC" });

    const response = await request(app)
        .post("/address")
        .set("Authorization", "Bearer test-token-123")
        .send({ address: BTC_ADDRESS, label: "Other label", ticker: "ETH" });
    expect(response.body).toEqual({ error: "The address must be unique" });
    expect(response.status).toBe(409);
});

test("/POST create second address with same ticker returns 201", async () => {
    await request(app)
        .post("/address")
        .set("Authorization", "Bearer test-token-123")
        .send({ address: BTC_ADDRESS, label: "Wallet 1", ticker: "BTC" });

    const response = await request(app)
        .post("/address")
        .set("Authorization", "Bearer test-token-123")
        .send({ address: ETH_ADDRESS, label: "Wallet 2", ticker: "BTC" });
    expect(response.body).toEqual({
        id: 2,
        address: ETH_ADDRESS,
        label: "Wallet 2",
        ticker: "BTC",
    });
    expect(response.status).toBe(201);
});

test("PUT change address 200", async () => {
    await request(app)
        .post("/address")
        .set("Authorization", "Bearer test-token-123")
        .send({ address: BTC_ADDRESS, label: "My wallet", ticker: "BTC" });

    const response = await request(app)
        .put("/address/1")
        .set("Authorization", "Bearer test-token-123")
        .send({ label: "Updated wallet", ticker: "ETH" });

    expect(response.body).toEqual({
        id: 1,
        address: BTC_ADDRESS,
        label: "Updated wallet",
        ticker: "ETH",
    });
    expect(response.status).toBe(200);
});

test("PUT change undefined address returns 404", async () => {
    const response = await request(app)
        .put("/address/999")
        .set("Authorization", "Bearer test-token-123")
        .send({ label: "My wallet", ticker: "BTC" });
    expect(response.body).toEqual({ error: "Address not found" });
    expect(response.status).toBe(404);
});

test("DELETE remove address 204", async () => {
    await request(app)
        .post("/address")
        .set("Authorization", "Bearer test-token-123")
        .send({ address: BTC_ADDRESS, label: "My wallet", ticker: "BTC" });

    const response = await request(app)
        .delete("/address/1")
        .set("Authorization", "Bearer test-token-123");

    expect(response.status).toBe(204);
});

test("DELETE undefined address returns 404", async () => {
    const response = await request(app)
        .delete("/address/999")
        .set("Authorization", "Bearer test-token-123");
    expect(response.body).toEqual({ error: "There is no such address" });
    expect(response.status).toBe(404);
});
