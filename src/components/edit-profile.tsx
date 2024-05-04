"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPencilAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { EditModal } from "@/components/modals/edit-modal";
import { changeName } from "@/functions/user";
import { useToast } from "@/components/ui/toast";

interface EditNameProps {
    firstName: string;
    lastName: string | null;
    id: string;
}

export const EditName: React.FC<EditNameProps> = ({ firstName, lastName, id }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const [data, setData] = useState({
        fName: firstName,
        lName: lastName || null
    });

    const handleSave = async () => {
        setLoading(true);
        try {
            if (!data.fName) {
                return useToast({ success: false, message: "First Name is required." });
            }

            await changeName({
                firstName: data.fName,
                lastName: data.lName,
                id
            })

            useToast({ success: true, message: "Name updated successfully." });
            router.refresh();
            setOpen(false);
        } catch (error) {
            useToast({ success: false, message: "Something went wrong." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <EditModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={handleSave}
                loading={loading}
                data={data}
                setData={setData}
            />
            <Button
                size={"sm"}
                variant="secondary"
                disabled={loading}
                onClick={() => setOpen(true)}
            ><FaPencilAlt /></Button>
        </>
    )
}