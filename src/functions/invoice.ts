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

export async function getInvoices(userId: string): Promise<ApiResponse> {
    await dbConnect();
    try {
        const invoices = await InvoiceModel.find({ userId: new mongoose.Types.ObjectId(userId) }).populate('businessId');

        return { success: true, message: "Invoices fetched successfully.", data: invoices };
    } catch (error) {
        return { success: false, message: "Something went wrong." };
    }
}

export async function getInvoiceById({ userId, id }: { userId: string, id: string }): Promise<ApiResponse> {
    await dbConnect();
    try {
        const invoice = await InvoiceModel.findOne({ userId: new mongoose.Types.ObjectId(userId), _id: new mongoose.Types.ObjectId(id) }).populate('businessId');

        return { success: true, message: "Invoice fetched successfully.", data: invoice };
    } catch (error) {
        return { success: false, message: "Something went wrong." };
    }
}

export async function updateInvoice({ data, userId, id }: InvoiceProps): Promise<ApiResponse> {
    await dbConnect();
    try {
        // @ts-ignore
        data.userId = new mongoose.Types.ObjectId(userId);

        await InvoiceModel.updateOne({ userId: new mongoose.Types.ObjectId(userId), _id: new mongoose.Types.ObjectId(id) }, data);

        return { success: true, message: "Invoice updated successfully." };
    } catch (error) {
        return { success: false, message: "Something went wrong." };
    }
}

export async function deleteInvoice(userId: string, id: string): Promise<ApiResponse> {
    await dbConnect();
    try {
        await InvoiceModel.deleteOne({ userId: new mongoose.Types.ObjectId(userId), _id: new mongoose.Types.ObjectId(id) });

        return { success: true, message: "Invoice deleted successfully." };
    } catch (error) {
        return { success: false, message: "Something went wrong." };
    }
}