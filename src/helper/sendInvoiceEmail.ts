"use server";

import { render } from "@react-email/render";

import invoiceEmail from "@/emails/InvoiceEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendInvoiceEmail(
    email: string,
    data: any
): Promise<ApiResponse> {
    try {
        const req = await fetch("https://mailer-ritik.vercel.app/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sender: {
                    name: data?.businessName,
                    mail: process.env.EMAIL_SERVER_USER,
                    password: process.env.EMAIL_SERVER_PASSWORD
                },
                receiver: email,
                subject: `Invoice ${data?.invoiceNumber} | ${process.env.NEXT_PUBLIC_APP_NAME}`,
                data: render(invoiceEmail({ data })),
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
            message: "Invoice sent successfully.",
        };
    } catch (error) {
        console.error("[VERIFICATION_EMAIL]", error);
        return {
            success: false,
            message: "Failed to send invoice."
        };
    }
}

