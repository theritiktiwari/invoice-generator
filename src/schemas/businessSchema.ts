import { z } from "zod";

export const businessSchema = z.object({
    userId: z.string().min(1, { message: "User ID must be at least 1 character" }),
    businessName: z.string().min(1, { message: "Name must be at least 1 character" }),
    businessLogo: z.string().optional(),
    businessAddress: z.object({
        address1: z.string().min(3, { message: "Address must be at least 3 character" }),
        address2: z.string().min(3, { message: "Address must be at least 3 character" }).optional(),
        city: z.string().min(2, { message: "City must be at least 2 character" }),
        state: z.string().min(2, { message: "State must be at least 2 character" }),
        zip: z.string().min(3, { message: "ZIP must be at least 3 characters" }),
    }),
    email: z.string().email({ message: "Invalid email" }).optional(),
    website: z.string().min(1, { message: "Website must be at least 1 character" }).optional(),
    businessGST: z.string().min(5, { message: "GST must be at least 5 characters" }).optional(),
    businessPAN: z.string().length(10, { message: "PAN must be of 10 characters" }).optional(),
    businessSignature: z.string(),
    accountNumber: z.string().min(5, { message: "Account number must be at least 5 characters" }),
    ifscCode: z.string().length(11, { message: "IFSC must be of 11 characters" }),
    bankName: z.string().min(2, { message: "Bank name must be at least 2 characters" }),
    upiId: z.string().min(5, { message: "UPI ID must be at least 5 character" })
});