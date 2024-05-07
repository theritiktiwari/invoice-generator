"use server";

import mongoose from "mongoose";
import crypto from "crypto";
import axios from "axios";
import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import BusinessModel from "@/models/Business";
import { BusinessInterface } from "@/models/index";
import { ApiResponse } from "@/types/ApiResponse";

interface BusinessProps {
    data: BusinessInterface;
    userId: string;
    id?: string;
}

const getPublicIdFromURL = (url: string) => {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    const publicId = fileName.split('.')[0];
    return publicId;
}

const generateSHA1 = (data: any) => {
    const hash = crypto.createHash("sha1");
    hash.update(data);
    return hash.digest("hex");
}

const generateSignature = (publicId: string, apiSecret: string) => {
    const timestamp = new Date().getTime();
    return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
};

const handleDeleteImage = async (itemUrl: string) => {
    const ID = getPublicIdFromURL(itemUrl);
    if (!ID) return;

    const publicId = "invoice-generator/" + ID;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const timestamp = new Date().getTime();
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!;
    const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!;
    const signature = generateSHA1(generateSignature(publicId, apiSecret));
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

    try {
        const response = await axios.post(url, {
            public_id: publicId,
            signature: signature,
            api_key: apiKey,
            timestamp: timestamp,
        });

        return response?.data;
    } catch (error: any) {
        return error?.response?.data;
    }
};

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

        const logo = business.businessLogo;
        const signature = business.businessSignature;

        const user = await UserModel.findById(userId);
        if (!user) return { success: false, message: "User not found." };

        // @ts-ignore
        data.userId = new mongoose.Types.ObjectId(userId);
        await BusinessModel.findByIdAndUpdate(id, data, { new: true });

        logo && handleDeleteImage(logo);
        signature && handleDeleteImage(signature);

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

        const logo = business.businessLogo;
        const signature = business.businessSignature;

        const user = await UserModel.findById(userId);
        if (!user) return { success: false, message: "User not found." };

        user.businessDetails = user.businessDetails.filter((businessId) => businessId.toString() !== id);
        user.save();

        await BusinessModel.findByIdAndDelete(id);

        logo && handleDeleteImage(logo);
        signature && handleDeleteImage(signature);

        return { success: true, message: "Business details deleted successfully." };
    } catch (error) {
        return { success: false, message: "Something went wrong." };
    }
}