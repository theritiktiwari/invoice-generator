"use server";

import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import BusinessModel from "@/models/Business";
import InvoiceModel from "@/models/Invoice";
import { handleDeleteImage } from "./business";

export async function changeName(data: { firstName: string; lastName: string | null; id: string }) {
    await dbConnect();

    const user = await UserModel.findByIdAndUpdate({ _id: data.id }, {
        fullName: {
            firstName: data.firstName,
            lastName: data.lastName
        }
    }, { new: true });
    if (!user) throw new Error("User not found");
}

export async function getName(id: string) {
    await dbConnect();

    const user = await UserModel.findById(id);
    if (!user) throw new Error("User not found");

    return user.fullName;
}

export async function getUserDetailById(value: { id: string, userId: string }) {
    await dbConnect();

    const user = await UserModel.findById(value?.userId);
    if (!user) throw new Error("User not found");

    if (user.role !== "ADMIN") throw new Error("Unauthorized Access");

    const users = await UserModel.find({
        _id: value?.id
    }, { password: 0, businessDetails: 0, updatedAt: 0, __v: 0 });
    if (!users) throw new Error("Users not found");

    return { success: true, data: users }
}

export async function getUsersDetails(id: string) {
    await dbConnect();

    const user = await UserModel.findById(id);
    if (!user) throw new Error("User not found");

    if (user.role !== "ADMIN") throw new Error("Unauthorized Access");

    const users = await UserModel.find({}, { password: 0, businessDetails: 0, updatedAt: 0, __v: 0 });
    if (!users) throw new Error("Users not found");

    return { success: true, data: users }
}

export async function addUserDetails(value: { adminId: string; data: any }) {
    await dbConnect();

    const user = await UserModel.findById(value?.adminId);
    if (!user) throw new Error("User not found");

    if (user.role !== "ADMIN") throw new Error("Unauthorized Access");

    const existingUser = await UserModel.findOne({ email: value?.data?.email });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(value?.data?.password, 10);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    const newUser = new UserModel({
        ...value?.data,
        password: hashedPassword,
        verifiedCodeExpiry: expiryDate
    });

    await newUser.save();

    return { success: true, message: "User added successfully" };
}

export async function updateUserDetails(value: { adminId: string; userId: string; data: any }) {
    await dbConnect();

    const user = await UserModel.findById(value?.adminId);
    if (!user) throw new Error("User not found.");

    if (user.role !== "ADMIN") throw new Error("Unauthorized Access");

    const existingUser = await UserModel.findById(value?.userId);
    if (!existingUser) throw new Error("User not found.");

    const hashedPassword = value?.data?.password && await bcrypt.hash(value?.data?.password, 10);

    await UserModel.findByIdAndUpdate({ _id: value?.userId }, {
        ...value?.data,
        password: hashedPassword
    });

    return { success: true, message: "User updated successfully" };
}

export async function deleteUserDetails(value: { adminId: string; userId: string }) {
    await dbConnect();

    const user = await UserModel.findById(value?.adminId);
    if (!user) throw new Error("User not found.");

    if (user.role !== "ADMIN") throw new Error("Unauthorized Access");

    const existingUser = await UserModel.findById(value?.userId);
    if (!existingUser) throw new Error("User not found.");

    const businesses = await BusinessModel.find({ userId: value?.userId });
    const images = [];
    if (businesses) {
        for (let business of businesses) {
            await InvoiceModel.deleteMany({ businessId: business._id });

            if (business.businessLogo) images.push(business.businessLogo);
            if (business.businessSignature) images.push(business.businessSignature);
        }
        await BusinessModel.deleteMany({ userId: value?.userId });
    }

    images?.forEach((image) => handleDeleteImage(image));

    await UserModel.findByIdAndDelete(value?.userId);

    return { success: true, message: "User deleted successfully" };
}