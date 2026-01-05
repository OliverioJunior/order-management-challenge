import { User, type IUserDocument } from "../models/User";
import type { RegisterSchema } from "../validators/authValidator";

export class UserRepository {
    async findByEmail(email: string): Promise<IUserDocument | null> {
        return await User.findOne({ email });
    }

    async create(data: RegisterSchema): Promise<IUserDocument> {
        return await User.create(data);
    }

    async findById(id: string): Promise<IUserDocument | null> {
        return await User.findById(id);
    }
}