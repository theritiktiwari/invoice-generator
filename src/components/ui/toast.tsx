"use client"

import { toast } from "react-hot-toast";

interface ToastProps {
  success: boolean;
  message: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  duration?: number;
}

export function useToast({
  success,
  message,
  position = "bottom-right",
  duration = 4000
}: ToastProps) {
  if (success) {
    return toast.success(message, {
      position,
      duration
    })
  } else {
    return toast.error(message, {
      position,
      duration
    })
  }
}