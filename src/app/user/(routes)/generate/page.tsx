import { getBusinessDetails } from "@/functions/business";
import GenerateInvoive from "./components/form";
import { getSession } from "@/helper/getSession";

export default async function Page() {
    const session = await getSession();

    const response = await getBusinessDetails(session?.user?._id);
    const business = response.data ? JSON.parse(JSON.stringify(response.data)) : null;

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <GenerateInvoive business={business} />
        </div>
    )
}