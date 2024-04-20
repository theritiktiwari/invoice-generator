import { resend } from "@/lib/mail";
import verifiyEmail from "@/emails/VerifyEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    userName: string,
    verifyCode: string,
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: `Verification Code | ${process.env.APP_NAME}`,
            react: verifiyEmail({ validationCode: verifyCode, userName }),
        });

        return {
            success: true,
            message: "Verification email sent successfully.",
        };
    } catch (error) {
        console.error("[VERIFICATION_EMAIL]", error);
        return {
            success: false,
            message: "Failed to send verification email."
        };
    }
}

