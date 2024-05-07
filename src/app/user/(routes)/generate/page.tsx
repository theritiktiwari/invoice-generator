import { getBusinessDetails } from "@/functions/business";
import GenerateInvoice from "./components/form";
import { getSession } from "@/helper/getSession";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await getSession();

    const response = await getBusinessDetails(session?.user?._id);
    const business = response.data ? JSON.parse(JSON.stringify(response.data)) : null;

    if (!business.length) {
        return redirect("/user/business/new");
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <GenerateInvoice business={business} />
        </div>
    )
}