import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const setCurrency = (value: string) => {
  const label = "en-" + value.substring(0, 2).toUpperCase();

  return new Intl.NumberFormat(label, {
    style: 'currency',
    currency: value,
  });
}