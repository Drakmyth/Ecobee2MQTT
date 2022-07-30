import app from "../src/app";
import request from "supertest";

describe("GET /api", () => {
    test("Hello Request", async () => {
        const result = await request(app).get("/api");
        expect(JSON.parse(result.text)).toEqual({message: "Hello from server!"});
        expect(result.statusCode).toEqual(200);
    });
});