import { NextRequest, NextResponse } from "next/server";
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const url = request.nextUrl;

    if (token && url.pathname.startsWith('/auth/')) {
        return NextResponse.redirect(new URL('/user', request.url));
    }

    if (!token && !(url.pathname.startsWith('/auth/'))) {
        return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        "/",
        "/user/:path*",
        "/auth/:path*",
    ],
}