import { HomeButton } from "@/components/home-page";

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="px-5 w-screen h-screen flex items-center justify-center">
            <HomeButton className="absolute top-5 left-5" />
            {children}
        </div>
    );
}
