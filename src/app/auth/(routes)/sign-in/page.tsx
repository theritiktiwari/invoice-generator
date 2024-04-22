import { AuthCard } from "@/components/auth";

export default async function Page() {
    return <>
        <AuthCard
            heading="Sign In"
            description="Please authenticate yourself to access your account."
            page="sign-in"
        />
    </>
}