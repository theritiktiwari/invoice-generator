import { redirect } from "next/navigation";
import { BusinessForm } from "./components/input-form";
import { getBusinessDetailById } from "@/functions/business";
import { getSession } from "@/helper/getSession";
import { BusinessInterface } from "@/models";

export default async function Page({ params }: { params: { id: string } }) {
    if (!/^[0-9a-fA-F]{24}$/.test(params.id) && params.id !== "new") {
        return redirect("/404");
    }

    const session = await getSession();
    const response = await getBusinessDetailById({ id: params.id, userId: session?.user?._id });
    const business: BusinessInterface = response?.data ? JSON.parse(JSON.stringify(response.data)) : null;

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BusinessForm initialData={business} />
            </div>
        </div>
    );
}