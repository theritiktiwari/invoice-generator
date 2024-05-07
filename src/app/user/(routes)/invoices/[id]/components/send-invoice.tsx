"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { UseToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { sendInvoiceEmail } from "@/helper/sendInvoiceEmail";
import { EmailModal } from "@/components/modals/email-modal";

export function SendInvoice({ data }: { data: any }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");

    const sendInvoice = async () => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            UseToast({
                success: false,
                message: "Please enter a valid email."
            });
            return;
        }
        
        try {
            setLoading(true);
            const emailResponse = await sendInvoiceEmail(email, data);
            UseToast(emailResponse);
        } catch (error: any) {
            UseToast({
                success: false,
                message: error?.message || "Something went wrong."
            });
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <EmailModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={sendInvoice}
                loading={loading}
                setEmail={setEmail}
            />
            <Button
                variant={"secondary"}
                onClick={() => setOpen(true)}
            >
                <Mail className="h-4 w-4 mr-2" /> Send Mail
            </Button>
        </>
    );
}