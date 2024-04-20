import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import { verifySchema } from "@/schemas/verifySchema";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { email, code } = await request.json();
        const decodedEmail = decodeURIComponent(email);

        const codeValidation = verifySchema.safeParse({ code });
        if (!codeValidation.success) {
            const codeErrors = codeValidation.error.format().code?._errors || [];

            return Response.json({
                success: false,
                message: codeErrors?.length > 0 ? codeErrors.join(', ') : "Error in verification code."
            }, { status: 400 });
        }

        const user = await UserModel.findOne({ email: decodedEmail });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found."
            }, { status: 404 });
        }

        const isCodeValid = user.verifyCode === codeValidation?.data?.code;
        const isCodeNotExpired = new Date(user.verifiedCodeExpiry!) > new Date();

        if (!isCodeValid) {
            return Response.json({
                success: false,
                message: "Invalid verification code."
            }, { status: 400 });
        }

        if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code expired. Please signup again."
            }, { status: 400 });
        }

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();

            return Response.json({
                success: true,
                message: "Account verified successfully."
            }, { status: 200 });
        }
    } catch (error) {
        console.error("[VERIFY_CODE_API]", error);
        return Response.json({
            success: false,
            message: "Cannot verify. Please try again."
        }, { status: 500 });
    }
}