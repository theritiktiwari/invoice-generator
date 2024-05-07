import { redirect } from "next/navigation";
import { UserForm } from "./components/input-form";
import { getUserDetailById } from "@/functions/user";
import { getSession } from "@/helper/getSession";

export default async function Page({ params }: { params: { id: string } }) {
    if (!/^[0-9a-fA-F]{24}$/.test(params.id) && params.id !== "new") {
        return redirect("/404");
    }

    const session = await getSession();
    let user = null;
    if (/^[0-9a-fA-F]{24}$/.test(params.id)) {
        const response = await getUserDetailById({ id: params.id, userId: session?.user?._id });
        user = response?.data ? JSON.parse(JSON.stringify(response.data[0])) : null;
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <UserForm initialData={user} />
            </div>
        </div>
    );
}