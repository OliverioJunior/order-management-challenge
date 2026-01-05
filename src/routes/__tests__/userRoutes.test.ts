import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import app from "../../app";
import { MongooseError } from "mongoose";

const mockSave = vi.fn();
vi.mock("../../models/User", () => {
    return {
        User: vi.fn().mockImplementation(function (data) {
            return {
                ...data,
                _id: "mocked-id",
                save: mockSave,
            };
        }),
    };
});




describe("POST /users", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should create a user and return 201", async () => {
        const userData = { email: "test@example.com", password: "password123" };
        mockSave.mockResolvedValueOnce(undefined);

        const response = await request(app).post("/users").send(userData);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            id: "mocked-id",
            email: "test@example.com"
        });
        expect(mockSave).toHaveBeenCalled();
    });

    it("should return 400 if email is missing", async () => {
        const response = await request(app).post("/users").send({ email: "test@example.com" });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Email and password are required");
    });

    it("should return 400 if password is missing", async () => {
        const response = await request(app).post("/users").send({
            email: "test@example.com"
        })
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Email and password are required")
    })

    it("should return 409 if user already exists", async () => {
        const userData = { email: "existing@example.com", password: "password123" };
        const error = new MongooseError("E11000 duplicate key error collection: mydb.users index: email_1 dup key: { email: \"existing@example.com\" }");

        mockSave.mockRejectedValueOnce(error);

        const response = await request(app).post("/users").send(userData);
        expect(response.status).toBe(409);
        expect(response.body.message).toBe("Email already exists");
    });

    it("should return 500 if an error occurs", async () => {
        const userData = { email: "test@example.com", password: "password123" };
        const error = new Error("Something went wrong");

        mockSave.mockRejectedValueOnce(error);

        const response = await request(app).post("/users").send(userData);
        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Internal Server Error");
    });
});
