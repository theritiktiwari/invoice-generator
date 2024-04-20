import { render } from "@react-email/render";

import verifiyEmail from "@/emails/VerifyEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    userName: string,
    verifyCode: string,
): Promise<ApiResponse> {
    try {
        const req = await fetch("https://mailer-ritik.vercel.app/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sender: {
                    name: process.env.APP_NAME,
                    mail: process.env.EMAIL_SERVER_USER,
                    password: process.env.EMAIL_SERVER_PASSWORD
                },
                receiver: email,
                subject: `Verification Code | ${process.env.APP_NAME}`,
                data: render(verifiyEmail({ validationCode: verifyCode, userName })),
            })
        });

        const res = await req.json();
        if (res.type === "error") {
            return {
                success: false,
                message: res.message
            };
        }
        
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

