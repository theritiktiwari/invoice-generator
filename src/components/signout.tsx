"use client";

import { signOut } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export const SignOut = () => {
    return (
        <>
            <Button
                variant={"destructive"}
                size={"icon"}
                onClick={() => signOut()}
            ><FaSignOutAlt /></Button>
        </>
    )

}