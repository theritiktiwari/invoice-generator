"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export function SendInvoice() {
    const [loading, setLoading] = useState(false);

    const sendInvoice = async () => {
        useToast({ success: true, message: "Invoice sent successfully." });
    }

    return (
        <>
            <Button
                variant={"secondary"}
                onClick={() => sendInvoice()}
            >
                <Mail className="h-4 w-4 mr-2" /> Send Mail
            </Button>
        </>
    );
}