import { format } from "date-fns";
import { getSession } from "@/helper/getSession"
import { BusinessColumn } from "./components/columns"
import { BusinessClient } from "./components/client";
import { getBusinessDetails } from "@/functions/business";

export default async function Page() {
    const session = await getSession();
    const response = await getBusinessDetails(session?.user?._id);
    const businessDetails = response.success ? response.data : [];

    const formattedData: BusinessColumn[] = businessDetails ? businessDetails.map((item: any) => ({
        id: item?._id?.toString(),
        businessName: item?.businessName,
        createdAt: format(item?.createdAt || new Date(), 'MMMM do, yyyy'),
    })) : [];

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BusinessClient data={formattedData} />
            </div>
        </div>
    )
}