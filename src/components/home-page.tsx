"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ChevronLeft } from "lucide-react";

export default function PageButtons({ data }: { data: any }) {
    const router = useRouter();

    return (
        <>
            <div className="flex gap-2">
                <Button
                    onClick={() => router.push(`${data ? "/user" : "/auth/sign-in"}`)}
                >
                    {data ? "Carry On" : "Sign In"}
                </Button>
                <ThemeToggle />
            </div>
        </>
    )
};

export function HomeButton({
    className
}: Readonly<{
    className: string;
}>) {
    const router = useRouter();

    return (
        <Button
            className={className}
            variant={"secondary"}
            onClick={() => router.push("/")}
        >
            <ChevronLeft className="mr-1 h-4 w-4" /> Home
        </Button>
    )
}