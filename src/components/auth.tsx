"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FaGithub, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";

import { signInSchema, signUpSchema, verifySchema } from "@/schemas/authSchema";
import { useOrigin } from "@/hooks/use-origin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UseToast } from "@/components/ui/toast";

export function OAuth({ page }: { page: string }) {
    const origin = useOrigin();
    return <>
        <div className="flex flex-col gap-2 mt-3 md:flex-row">
            <Button onClick={() => signIn('github', {
                callbackUrl: origin
            })} className="w-full" variant={"secondary"}>
                <FaGithub className="mr-2" />
                {page === "sign-in" ? "Sign Up with GitHub" : "Sign Up with GitHub"}
            </Button>
            <Button onClick={() => signIn('google', {
                callbackUrl: origin
            })} className="w-full" variant={"secondary"}>
                <FaGoogle className="mr-2" />
                {page === "sign-in" ? "Sign Up with Google" : "Sign Up with Google"}
            </Button>
        </div>
    </>
};

export function SignUp() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        },
    });

    async function onSubmit(data: z.infer<typeof signUpSchema>) {
        try {
            setLoading(true);
            const response = await axios.post("/api/auth/sign-up", data);

            UseToast(response?.data);
            router.refresh();
            router.push(`/auth/verify-code/${data?.email}`);
        } catch (error) {
            // @ts-ignore
            UseToast({ success: false, message: error?.response?.data?.message || "Error while creating account." });
        } finally {
            setLoading(false);
        }
    }

    return <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
                <div className="flex flex-col md:flex-row gap-2">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="Enter your first name"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="Enter your last name"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="email"
                                    placeholder="Enter your email address"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="relative">
                            <FormControl>
                                <Input
                                    {...field}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                />
                            </FormControl>
                            <div>
                                {!showPassword && <FaEye
                                    onClick={() => setShowPassword(true)}
                                    className="cursor-pointer text-gray-600 absolute top-3 right-3 h-4 w-4"
                                />}
                                {showPassword && <FaEyeSlash
                                    onClick={() => setShowPassword(false)}
                                    className="cursor-pointer text-gray-600 absolute top-3 right-3 h-4 w-4"
                                />}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={loading} variant={"default"} className="w-full mt-3">
                    {loading ? "Processing..." : "Click to Sign Up"}
                </Button>
            </form>
        </Form>
    </>
}

export function SignIn() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const origin = useOrigin();
    const router = useRouter();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: z.infer<typeof signInSchema>) {
        try {
            setLoading(true);
            const response = await signIn('credentials', {
                email: data?.email,
                password: data?.password,
                callbackUrl: origin,
                redirect: false
            });

            if (response?.error) {
                return UseToast({ success: false, message: "Invalid credentials." });
            }

            UseToast({ success: true, message: "Signed in successfully." });
            router.refresh();
            router.push("/user");
        } catch (error) {
            UseToast({ success: false, message: "Error while authenticating." });
        } finally {
            setLoading(false);
        }
    }

    return <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="email"
                                    placeholder="Enter your email address"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="relative">
                            <FormControl>
                                <Input
                                    {...field}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                />
                            </FormControl>
                            <div>
                                {!showPassword && <FaEye
                                    onClick={() => setShowPassword(true)}
                                    className="cursor-pointer text-gray-600 absolute top-3 right-3 h-4 w-4"
                                />}
                                {showPassword && <FaEyeSlash
                                    onClick={() => setShowPassword(false)}
                                    className="cursor-pointer text-gray-600 absolute top-3 right-3 h-4 w-4"
                                />}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={loading} variant={"default"} className="w-full mt-3">
                    {loading ? "Processing..." : "Click to Sign In"}
                </Button>
            </form>
        </Form>
    </>
}

export function AuthCard({
    heading,
    description,
    page
}: {
    heading: string;
    description: string;
    page: string;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{heading}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col">
                    {page === "sign-in" && <SignIn />}
                    {page === "sign-up" && <SignUp />}
                    <OAuth page={page} />
                </div>
                <CardDescription className="mt-3 flex justify-end">
                    {page === "sign-in" && <>
                        Don&apos;t have an account?<Link href="/auth/sign-up" className="ml-1 text-blue-500 font-semibold">Sign Up</Link>
                    </>}
                    {page === "sign-up" && <>
                        Already have an account? <Link href="/auth/sign-in" className="ml-1 text-blue-500 font-semibold">Sign In</Link>
                    </>}
                </CardDescription>
            </CardContent>
        </Card>
    )
}

export function Verify({ email }: { email: string }) {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const emailValidationResult = verifySchema.pick({ email: true }).safeParse({ email });
    if (!emailValidationResult.success) {
        return (<>
            <Card>
                <CardHeader>
                    <CardTitle className="text-destructive">Error</CardTitle>
                    <CardDescription>Given email address is invalid. Please try again.</CardDescription>
                    <div className="pt-3">
                        <Button onClick={() => router.back()} variant="destructive" className="w-full">Go Back</Button>
                    </div>
                </CardHeader>
            </Card>
        </>);
    }

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            email: email,
            code: "",
        },
    });

    async function onSubmit(data: z.infer<typeof verifySchema>) {
        try {
            setLoading(true);
            const response = await axios.post("/api/auth/verify-code", data);

            UseToast(response?.data);
            router.refresh();
            router.push(`/auth/sign-in`);
        } catch (error) {
            // @ts-ignore
            UseToast({ success: false, message: error?.response?.data?.message || "Error while creating account." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Verify Now</CardTitle>
                <CardDescription>Please enter the OTP sent to your email address.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>One-Time Password</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit">
                            {loading ? "Processing..." : "Submit"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}