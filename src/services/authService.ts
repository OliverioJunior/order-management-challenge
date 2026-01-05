import { User } from "../models/User";
import type { RegisterSchema } from "../validators/authValidator";

export class AuthService {
    async registerUser(data: RegisterSchema) {
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            throw new Error("User already registered");
        }
        const user = await User.create(data);
        return user;
    }
    async authenticateUser(email: string, password: string) {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            throw new Error("Invalid credentials");
        }
        return user;
    }
}