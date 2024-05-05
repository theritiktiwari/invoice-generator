"use server";

import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import BusinessModel from "@/models/Business";
import { BusinessInterface } from "@/models/index";
import mongoose from "mongoose";
import { ApiResponse } from "@/types/ApiResponse";

interface BusinessProps {
    data: BusinessInterface;
    userId: string;
    id?: string;
}

export async function addBusinessDetails({ data, userId }: BusinessProps): Promise<ApiResponse> {
    await dbConnect();
    try {
        // @ts-ignore
        data.userId = new mongoose.Types.ObjectId(userId);

        const businessDetail = new BusinessModel(data);
        businessDetail.save();

        const user = await UserModel.findById(userId);
        user?.businessDetails.push(businessDetail._id);
        user?.save();

        return { success: true, message: "Business details added successfully." };
    } catch (error) {
        return { success: false, message: "Something went wrong." };
    }
}

export async function getBusinessDetails(userId: string): Promise<ApiResponse> {
    await dbConnect();
    try {
        const user = await UserModel.findById(userId).populate("businessDetails");
        if (!user) return { success: false, message: "User not found." };

        return { success: true, message: "Business details fetched successfully.", data: user.businessDetails };
    } catch (error) {
        return { success: false, message: "Something went wrong." };
    }
}

export async function getBusinessDetailById(
    { id, userId }: {
        id: string;
        userId: string
    }): Promise<ApiResponse> {
    await dbConnect();
    try {
        const user = await UserModel.findById(userId).populate("businessDetails");
        if (!user) return { success: false, message: "User not found." };

        const business = user.businessDetails.find((item: any) => item?._id.toString() === id);
        if (!business) return { success: false, message: "Business not found." };

        return { success: true, message: "Business details fetched successfully.", data: business };
    } catch (error) {
        return { success: false, message: "Something went wrong." };
    }
}

export async function updateBusinessDetails({ data, userId, id }: BusinessProps): Promise<ApiResponse> {
    await dbConnect();
    try {
        const business = await BusinessModel.findById(id);
        if (!business) return { success: false, message: "Business not found." };

        const user = await UserModel.findById(userId);
        if (!user) return { success: false, message: "User not found." };

        // @ts-ignore
        data.userId = new mongoose.Types.ObjectId(userId);
        await BusinessModel.findByIdAndUpdate(id, data, { new: true });

        return { success: true, message: "Business details updated successfully." };
    } catch (error) {
        return { success: false, message: "Something went wrong." };
    }
}

export async function deleteBusinessDetails({ id, userId }: { id: string; userId: string }): Promise<ApiResponse> {
    await dbConnect();
    try {
        const business = await BusinessModel.findById(id);
        if (!business) return { success: false, message: "Business not found." };

        const user = await UserModel.findById(userId);
        if (!user) return { success: false, message: "User not found." };

        user.businessDetails = user.businessDetails.filter((businessId) => businessId.toString() !== id);
        user.save();

        await BusinessModel.findByIdAndDelete(id);

        return { success: true, message: "Business details deleted successfully." };
    } catch (error) {
        return { success: false, message: "Something went wrong." };
    }
}