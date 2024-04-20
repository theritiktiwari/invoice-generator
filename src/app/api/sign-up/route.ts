import bcrypt from "bcryptjs";

import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail"

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { appName, firstName, lastName, email, password } = await request.json();

        if ([appName, firstName, lastName, email, password].some(field => !field)) {
            return Response.json({
                success: false,
                message: "Please fill the required fields."
            }, { status: 400 });
        }

        const existingUser = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        if (existingUser) {
            if (existingUser.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exists."
                }, { status: 400 });
            } else {
                existingUser.fullName.firstName = firstName;
                existingUser.fullName.lastName = lastName;
                existingUser.password = hashedPassword;
                existingUser.verifyCode = verifyCode;
                existingUser.verifiedCodeExpiry = expiryDate;

                await existingUser.save();
            }
        } else {
            const newUser = new UserModel({
                fullName: {
                    firstName,
                    lastName
                },
                email,
                password: hashedPassword,
                role: "USER",
                isVerified: false,
                verifyCode,
                verifiedCodeExpiry: expiryDate,
                businessDetails: []
            });

            await newUser.save();
        }

        const userName = `${firstName} ${lastName}`;
        const emailResponse = await sendVerificationEmail(email, userName, verifyCode, appName);

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 });
        }

        return Response.json({
            success: true,
            message: "User registered successfully. Please verify your email."
        }, { status: 201 });

    } catch (error) {
        console.error("[SIGN_UP_API]", error);

        return Response.json({
            success: false,
            message: "Error while signing up."
        }, { status: 500 });
    }
}