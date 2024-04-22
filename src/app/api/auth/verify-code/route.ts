import dbConnect from "@/lib/db";
import UserModel from "@/models/User";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { email, code } = await request.json();

        const user = await UserModel.findOne({ email });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found."
            }, { status: 404 });
        }

        if(user.isVerified) {
            return Response.json({
                success: false,
                message: "User already verified."
            }, { status: 400 });
        }

        const isCodeValid = user.verifyCode === code;
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