"use server";

import dbConnect from "@/lib/db";
import UserModel from "@/models/User";

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