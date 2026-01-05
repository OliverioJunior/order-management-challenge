import request from "supertest";
import { describe, it, expect, vi } from "vitest";
import app from "../../app";

const mockedCheckDatabaseConnection = vi.fn();

vi.mock("../../utils/dbCheck", () => ({
    checkDatabaseConnection: () => mockedCheckDatabaseConnection(),
}));

describe("GET /status", () => {
    it("should return 200 OK when database is connected", async () => {
        mockedCheckDatabaseConnection.mockReturnValue({
            status: "connected",
            stateCode: 1,
        });

        const response = await request(app).get("/status");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: "OK",
            database: "connected",
        });
    });

    it("should return 503 Service Unavailable when database is disconnected", async () => {
        mockedCheckDatabaseConnection.mockReturnValue({
            status: "disconnected",
            stateCode: 0,
        });

        const response = await request(app).get("/status");
        expect(response.status).toBe(503);
        expect(response.body).toEqual({
            message: "Service Unavailable",
            database: "disconnected",
        });
    });
});
