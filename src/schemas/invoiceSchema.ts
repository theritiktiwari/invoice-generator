import { z } from "zod";

const itemSchema = z.object({
    name: z.string().min(1, { message: "Item name must be at least 1 character" }),
    quantity: z.number().min(1, { message: "Quantity cannot be zero" }),
    price: z.number().min(1, { message: "Price cannot be zero" }),
});

export const invoiceSchema = z.object({
    businessId: z.string({ required_error: "Please select business name" }),
    customerName: z.string().min(3, { message: "Customer name must be at least 3 character" }),
    billingAddress: z.object({
        address1: z.string().min(3, { message: "Address must be at least 3 character" }),
        address2: z.string().min(3, { message: "Address must be at least 3 character" }).optional().or(z.literal('')),
        city: z.string().min(2, { message: "City must be at least 2 character" }),
        state: z.string().min(2, { message: "State must be at least 2 character" }),
        pincode: z.string().min(3, { message: "ZIP must be at least 3 characters" }),
    }),
    invoiceNumber: z.string().min(1, { message: "Invoice number must be at least 1 character" }),
    invoiceDate: z.date().refine((date) => date <= new Date(), { message: "Invoice date cannot be in the future" }),
    currency: z.string({ required_error: "Please select currency" }),
    paymentMode: z.string({ required_error: "Please select payment method" }),
    totalItems: z.number().min(1, { message: "Total items must be at least 1" }),
    productDetails: z.array(itemSchema).max(10, { message: "Maximum 10 items are allowed" }),
});