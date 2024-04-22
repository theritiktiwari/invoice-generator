import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/providers/auth-provider";
import { ToastProvider } from '@/providers/toast-provider'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Invoice Generator",
  description: "The app which generates invoices for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          <ToastProvider />
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
