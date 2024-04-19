import { z } from "zod";

export const invoiceSchema = z.object({
    userId: z.string().min(1, { message: "User ID must be at least 1 character" }),
    businessId: z.string().min(1, { message: "Business ID must be at least 1 character" }),
    billingAddress: z.object({
        address1: z.string().min(3, { message: "Address must be at least 3 character" }),
        address2: z.string().min(3, { message: "Address must be at least 3 character" }).optional(),
        city: z.string().min(2, { message: "City must be at least 2 character" }),
        state: z.string().min(2, { message: "State must be at least 2 character" }),
        zip: z.string().min(3, { message: "ZIP must be at least 3 characters" }),
    }),
    shippingAddress: z.object({
        address1: z.string().min(3, { message: "Address must be at least 3 character" }),
        address2: z.string().min(3, { message: "Address must be at least 3 character" }).optional(),
        city: z.string().min(2, { message: "City must be at least 2 character" }),
        state: z.string().min(2, { message: "State must be at least 2 character" }),
        zip: z.string().min(3, { message: "ZIP must be at least 3 characters" }),
    }).optional(),
    invoiceNumber: z.string().min(1, { message: "Invoice number must be at least 1 character" }),
    invoiceDate: z.string().min(1, { message: "Invoice date must be at least 1 character" }),
    currency: z.string().length(3, { message: "Currency must be of 3 characters" }),
    taxRate: z.number().optional(),
    taxType: z.string().optional(),
    discount: z.number().optional(),
    paymentMode: z.string().min(1, { message: "Payment mode must be at least 1 character" }),
    items: z.array(z.object({
        name: z.string().min(1, { message: "Item name must be at least 1 character" }),
        quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
        price: z.number().min(1, { message: "Price must be at least 1" }),
    })).min(1, { message: "At least 1 item must be present" }),
});