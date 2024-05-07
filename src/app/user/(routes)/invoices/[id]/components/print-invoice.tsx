"use client";

import { Printer } from "lucide-react";
import { UseToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export function PrintInvoice({ id }: { id: string }) {

    const printInvoice = async () => {
        document.title = `Invoice ${id}`;
        window.print();
        UseToast({ success: true, message: "Invoice downloaded successfully." });
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