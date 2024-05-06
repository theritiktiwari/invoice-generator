import { format } from "date-fns";
import { getSession } from "@/helper/getSession"
import { InvoiceColumn } from "./components/columns"
import { InvoiceClient } from "./components/client";
import { getInvoices } from "@/functions/invoice";

export default async function Page() {
    const session = await getSession();
    const response = await getInvoices(session?.user?._id);
    const invoices = response.success ? response.data : [];

    const formattedData: InvoiceColumn[] = invoices ? invoices.map((item: any) => ({
        id: item?._id?.toString(),
        businessName: item?.businessId?.businessName,
        customerName: item?.customerName,
        invoiceNumber: item?.invoiceNumber,
        invoiceDate: format(item?.invoiceDate || new Date(), 'MMMM do, yyyy'),
    })) : [];

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <InvoiceClient data={formattedData} />
            </div>
        </div>
    )
}