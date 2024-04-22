"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function PageButtons({ data }: { data: any }) {
    const router = useRouter();

    return (
        <>
            {data && <div className="flex gap-2">
                <Button
                    size={"lg"}
                    className="text-lg"
                    onClick={() => router.push(`${data ? "/user" : "/auth/sign-in"}`)}
                >
                    {data ? "Carry On" : "Sign In"}
                </Button>
                <ThemeToggle />
            </div>}
        </>
    )
};