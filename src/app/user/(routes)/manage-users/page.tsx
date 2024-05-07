import { format } from "date-fns";
import { getSession } from "@/helper/getSession"
import { UsersColumn } from "./components/columns"
import { UsersClient } from "./components/client";
import { getUsersDetails } from "@/functions/user";

export default async function Page() {
    const session = await getSession();
    const response = await getUsersDetails(session?.user?._id);
    const usersDetails = response.success ? response.data : [];

    const formattedData: UsersColumn[] = usersDetails ? usersDetails.map((item: any) => ({
        id: item?._id?.toString(),
        fullName: item?.fullName?.lastName ?
            (item?.fullName?.firstName + " " + item?.fullName?.lastName) :
            item?.fullName?.firstName,
        email: item?.email,
        role: item?.role,
        isVerified: item?.isVerified,
        createdAt: format(item?.createdAt || new Date(), 'MMMM do, yyyy'),
    })) : [];

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <UsersClient data={formattedData} />
            </div>
        </div>
    )
}