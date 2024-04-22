import "next-auth";

declare module "next-auth" {
    interface User {
        _id?: string;
        fullName?: {
            firstName?: string;
            lastName?: string;
        }
        isVerified?: boolean;
        email?: string;
        role?: string;
    }

    interface Session {
        user: User & DefaultSession["user"];
    }

    interface JWT {
        _id?: string;
        isVerified?: boolean;
        firstName?: string;
        lastName?: string;
        email?: string;
        role?: string;
    }
}