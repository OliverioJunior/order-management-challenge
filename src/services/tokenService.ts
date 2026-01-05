import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { AuthenticatedUser } from "../types/express";

export class TokenService {
    generateToken(payload: AuthenticatedUser): string {
        return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "1h" });
    }

    generateRefreshToken(payload: AuthenticatedUser): string {
        return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
    }
}
