import type { NextFunction, Request, Response } from "express";
import type { AuthenticatedUser } from "../types/express";
import { loginSchema, registerSchema } from "../validators/authValidator";
import type { AuthService } from "../services/authService";
import type { TokenService } from "../services/tokenService";

export class AuthController {
    constructor(
        private authService: AuthService,
        private tokenService: TokenService
    ) { }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = registerSchema.parse(req.body);
            const user = await this.authService.registerUser(validatedData);

            const tokenPayload: AuthenticatedUser = {
                userId: user._id.toString(),
                email: user.email
            };

            const token = this.tokenService.generateToken(tokenPayload);
            const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: { token, refreshToken }
            });
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = loginSchema.parse(req.body);
            const user = await this.authService.authenticateUser(
                validatedData.email,
                validatedData.password
            );

            const tokenPayload: AuthenticatedUser = {
                userId: user._id.toString(),
                email: user.email
            };

            const token = this.tokenService.generateToken(tokenPayload);
            const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);

            res.status(200).json({
                success: true,
                message: "Login successful",
                data: { token, refreshToken }
            });
        } catch (error) {
            next(error);
        }
    };
}