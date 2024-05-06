"use client";

import { useState } from "react";
import { Printer } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export function PrintInvoice() {
    const [loading, setLoading] = useState(false);

    const printInvoice = async () => {
        useToast({ success: true, message: "Invoice downloaded successfully." });
    }

    return (
        <>
            <Button
                variant={"default"}
                onClick={() => printInvoice()}
            >
                <Printer className="h-4 w-4 mr-2" /> Print
            </Button>
        </>
    );
}