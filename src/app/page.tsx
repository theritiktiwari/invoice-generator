"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const router = useRouter();
  const { data } = useSession();

  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center px-2">
        <div className="flex flex-col items-center">
          <p className="sm:text-7xl text-5xl font-bold leading-tight text-center sm:leading-tight lg:leading-tight">
            <span className="relative inline-flex sm:inline">
              <span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
              <span className="relative">Invoice Generator</span>
            </span>
          </p>
          <p className="mb-4 text-gray-400 text-center mt-4 text-md md:text-xl max-w-2xl font-medium">
            This app will generate invoices for you, modify them and save them and send them.
          </p>
          <div className="flex gap-2">
            <Button
              size={"lg"}
              className="text-lg"
              onClick={() => router.push(`${data?.user ? "/user" : "/auth/sign-in"}`)}
            >
              {data?.user ? "Carry On" : "Sign In"}
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}
