const request = require("supertest");
const app = require("../src/app");

process.env.AUTH_TOKEN = "test-token-123";

test("GET /status return ok", async () => {
  const res = await request(app)
    .get("/status")
    .set("Authorization", "Bearer test-token-123");
  expect(res.status).toBe(200);
  expect(res.text).toBe("ok");
});
