import { format } from "date-fns";
import { getSession } from "@/helper/getSession"
import { getInvoices } from "@/functions/invoice";
import { InvoiceColumn } from "./components/columns"
import { InvoiceClient } from "./components/client";
import Earning from "./components/earning";
import { InvoiceInterface } from "@/models";

export default async function Page() {
    const session = await getSession();
    const response = await getInvoices(session?.user?._id);
    const invoices = response.success ? JSON.parse(JSON.stringify(response.data)) : null;

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
                <Earning invoices={invoices} />
                <InvoiceClient data={formattedData} />
            </div>
        </div>
    )
}