import { z } from "zod";

export const registerSchema = z.object({
    email: z.email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long")
});

export const loginSchema = z.object({
    email: z.email("Invalid email format"),
    password: z.string().min(1, "Password is required")
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
