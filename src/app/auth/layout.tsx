export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="px-5 w-screen h-screen flex items-center justify-center">
            {children}
        </div>
    );
}
