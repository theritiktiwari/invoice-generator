"use server";

import dbConnect from "@/lib/db";
import InvoiceModel from "@/models/Invoice";
import { InvoiceInterface } from "@/models/index";
import mongoose from "mongoose";
import { ApiResponse } from "@/types/ApiResponse";

interface InvoiceProps {
    data: InvoiceInterface;
    userId: string;
    id?: string;
}

export async function addInvoive({ data, userId }: InvoiceProps): Promise<ApiResponse> {
    await dbConnect();
    try {
        // @ts-ignore
        data.userId = new mongoose.Types.ObjectId(userId);

        const invoice = new InvoiceModel(data);
        await invoice.save();

        return { success: true, message: "Business details added successfully.", data: invoice._id };
    } catch (error) {
        return { success: false, message: "Something went wrong." };
    }
}