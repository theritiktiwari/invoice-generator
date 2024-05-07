import { z } from "zod";

export const userSchema = z.object({
    fullName: z.object({
        firstName: z.string().min(3, { message: "First name must be at least 3 characters" }),
        lastName: z.string().optional().or(z.literal(''))
    }),
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }).optional().or(z.literal('')),
    role: z.string().refine((role) => role === "ADMIN" || role === "USER", {
        message: "Invalid role",
        path: ["role"]
    }),
    isVerified: z.boolean(),
    verifyCode: z.string().length(6, { message: "Verification code must be of 6 characters" })
});