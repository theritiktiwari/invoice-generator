"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  setEmail: (email: string) => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  setEmail,
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
      title="Send Invoice"
      description="Enter the email of the customer and send them the invoice on email."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="grid gap-4 py-4">
        <div className="flex justify-between items-center gap-2">
          <Input
            id="email"
            placeholder="Enter the email of the customer"
            className="col-span-3"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button disabled={loading} type="submit" onClick={onConfirm}>
            {loading ? "Sending..." : "Send Invoice"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};