import { Verify } from "@/components/auth";

export default async function Page({ params }: { params: { email: string } }) {
    const email = decodeURIComponent(params.email);
    return <>
        <Verify email={email} />
    </>
}