import { redirect } from "next/navigation";
import { EditInvoice } from "./components/edit-invoice";
import { ViewInvoice } from "./components/view-invoice";
import { getInvoiceById } from "@/functions/invoice";
import { getBusinessDetails } from "@/functions/business";
import { getSession } from "@/helper/getSession";
import { InvoiceInterface } from "@/models/index";

interface PageProps {
    params: {
        id: string;
    };
    searchParams: {
        query: string;
    };
}

export default async function Page({ params, searchParams }: PageProps) {
    if (!/^[0-9a-fA-F]{24}$/.test(params.id)) {
        return redirect("/404");
    }
    const { query } = searchParams;
    const session = await getSession();
    const invoiceResponse = await getInvoiceById({ userId: session?.user?._id, id: params.id });
    const invoice: InvoiceInterface = invoiceResponse?.data ? JSON.parse(JSON.stringify(invoiceResponse.data)) : null;

    if(!invoice) return redirect("/404");

    const businessResponse = await getBusinessDetails(session?.user?._id);
    const business = businessResponse.data ? JSON.parse(JSON.stringify(businessResponse.data)) : null;

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                {(query === "update") && <EditInvoice initialData={invoice} business={business} />}
                {(query === "view") && <ViewInvoice invoice={invoice} />}
            </div>
        </div>
    );
}