import mongoose, { Schema, type Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
    email: string;
    password: string;
}

export interface IUserDocument extends IUser, Document {
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Email is invalid"]
    },
    password: {
        type: String, required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        maxlength: [20, "Password must be at most 20 characters long"]
    },
}, {
    timestamps: true,
});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

userSchema.set("toJSON", {
    transform: (_doc, ret) => {
        const { password, ...rest } = ret;
        return rest;
    }
})

export const User = mongoose.model<IUserDocument>('User', userSchema);
