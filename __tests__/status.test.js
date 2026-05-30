const request = require("supertest");
process.env.AUTH_TOKEN = "test-token-123";
const {createApp} = require("../src/app");
const { createCurrencyService } = require("../src/services/currencyService");
let app = createApp(createCurrencyService(), {});


test("GET /status return ok", async () => {
  const res = await request(app)
    .get("/status")
    .set("Authorization", "Bearer test-token-123");
  expect(res.status).toBe(200);
  expect(res.text).toBe("ok");
});
