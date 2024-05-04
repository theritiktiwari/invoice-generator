"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  data: {
    fName: string;
    lName: string | null;
  }
  setData: (data: { fName: string; lName: string | null }) => void;
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  data,
  setData,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Edit Profile"
      description="Make changes to your profile here. Click save when you're done."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            First Name
          </Label>
          <Input
            id="fName"
            defaultValue={data.fName}
            className="col-span-3"
            onChange={(e) => setData({ ...data, fName: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Last Name
          </Label>
          <Input
            id="lName"
            defaultValue={data.lName || ""}
            className="col-span-3"
            onChange={(e) => setData({ ...data, lName: e.target.value })}
          />
        </div>
      </div>
      <DialogFooter>
        <Button disabled={loading} type="submit" onClick={onConfirm}>Save changes</Button>
      </DialogFooter>
    </Modal>
  );
};