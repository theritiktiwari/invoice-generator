import { AuthCard } from "@/components/pages/auth";

export default async function Page() {
    return <>
        <AuthCard
            heading="Sign Up"
            description="Please make your account to access the platform."
            page="sign-up"
        />
    </>
}