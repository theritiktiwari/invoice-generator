
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from 'bcryptjs';

import dbConnect from "@/lib/db";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: "Email Address", type: "email", placeholder: "email@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({ email: credentials.email });
                    if (!user) {
                        return null;
                    }
                    if (!user.isVerified) {
                        return null;
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordCorrect) {
                        return null;
                    }

                    return user;
                } catch (error: any) {
                    console.error("[NEXT_AUTH_CREDENTIALS_SIGN_IN]", error);
                    throw new Error(error);
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "credentials") {
                return true;
            }

            await dbConnect();

            const { name, email } = user;
            const password = process.env.DUMMY_PASSWORD!;
            const firstName = name?.split(" ")[0];
            const lastName = name?.split(" ")[1];

            if ([firstName, email].some(field => !field)) {
                return false;
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            try {
                const existingUser = await UserModel.findOne({ email });
                if (existingUser?.isVerified) {
                    return true;
                }

                if (existingUser && !existingUser.isVerified) {
                    existingUser.fullName.firstName = firstName!;
                    existingUser.fullName.lastName = lastName;
                    existingUser.email = email!;
                    existingUser.password = hashedPassword;
                    existingUser.isVerified = true;
                    await existingUser.save();

                    return true;
                }

                const newUser = new UserModel({
                    fullName: {
                        firstName,
                        lastName
                    },
                    email,
                    password: hashedPassword,
                    role: "USER",
                    isVerified: true,
                    verifyCode: "000000",
                    verifiedCodeExpiry: new Date(),
                    businessDetails: []
                });

                await newUser.save();

                return true;
            } catch (error) {
                console.error("[NEXT_AUTH_OAUTH_SIGN_IN]", error);
                return false;
            }
        },
        async jwt({ token, user, account }) {
            if (account?.provider === "credentials") {
                if (user) {
                    token._id = user._id?.toString();
                    token.isVerified = user.isVerified;
                    token.firstName = user.fullName?.firstName;
                    token.lastName = user.fullName?.lastName;
                    token.email = user.email;
                    token.role = user.role;
                }

                return token;
            } else {
                await dbConnect();
                const dbUser = await UserModel.findOne({ email: user?.email });
                if (dbUser) {
                    token._id = dbUser._id?.toString();
                    token.isVerified = dbUser.isVerified;
                    token.firstName = dbUser.fullName.firstName;
                    token.lastName = dbUser.fullName.lastName;
                    token.email = dbUser.email;
                    token.role = dbUser.role;
                    delete token.name;
                    delete token.picture;
                }
                return token;
            }
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id?.toString();
                session.user.isVerified = token.isVerified;
                session.user.firstName = token.firstName;
                session.user.lastName = token.lastName;
                session.user.email = token.email;
                session.user.role = token.role;
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/sign-in',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET
} satisfies NextAuthOptions;