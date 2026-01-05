const request = require("supertest");
const app = require("../src/server");

describe("URL Shortener endpoints", () => {
  test("POST /shorten rejects invalid url", async () => {
    const res = await request(app).post("/shorten").send({ url: "notaurl" });
    expect(res.statusCode).toBe(400);
  });
});
