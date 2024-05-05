import { z } from "zod";

export const businessSchema = z.object({
    businessName: z.string().min(1, { message: "Name must be at least 1 character" }),
    businessLogo: z.string().optional().or(z.literal('')),
    businessEmail: z.string().email({ message: "Invalid email" }).optional().or(z.literal('')),
    businessWebsite: z.string().min(1, { message: "Website must be at least 1 character" }).optional().or(z.literal('')),
    businessGST: z.string().min(5, { message: "GST must be at least 5 characters" }).optional().or(z.literal('')),
    businessPAN: z.string().length(10, { message: "PAN must be of 10 characters" }).optional().or(z.literal('')),
    businessAddress: z.object({
        address1: z.string().min(3, { message: "Address must be at least 3 character" }),
        address2: z.string().min(3, { message: "Address must be at least 3 character" }).optional().or(z.literal('')),
        city: z.string().min(2, { message: "City must be at least 2 character" }),
        state: z.string().min(2, { message: "State must be at least 2 character" }),
        pincode: z.string().min(3, { message: "ZIP must be at least 3 characters" }),
    }),
    businessSignature: z.string().min(1, { message: "Signature is required" }).refine((img) => img.trim() !== '', {
        message: "Signature is required",
        path: ["businessSignature"]
    }),
    paymentDetails: z.object({
        accountNumber: z.string().min(5, { message: "Account number must be at least 5 characters" }).optional().or(z.literal('')),
        ifscCode: z.string().length(11, { message: "IFSC must be of 11 characters" }).optional().or(z.literal('')),
        bankName: z.string().min(2, { message: "Bank name must be at least 2 characters" }).optional().or(z.literal('')),
        upiId: z.string().min(5, { message: "UPI ID must be at least 5 character" }).optional().or(z.literal('')),
    }),
    mailCredentials: z.object({
        userEmail: z.string().email({ message: "Invalid email" }).optional().or(z.literal('')),
        userPassword: z.string().min(5, { message: "Password must be at least 5 characters" }).optional().or(z.literal('')),
    }),
});