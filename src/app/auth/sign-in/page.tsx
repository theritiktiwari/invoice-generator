import { AuthCard } from "@/components/pages/auth";

export default async function Page() {
    return <>
        <AuthCard
            heading="Sign In"
            description="Please authenticate yourself to access your account."
            page="sign-in"
        />
    </>
}