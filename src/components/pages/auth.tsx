"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FaGithub, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";

import { signInSchema } from "@/schemas/signInSchema";
import { signUpSchema } from "@/schemas/signUpSchema";
import { useOrigin } from "@/hooks/use-origin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Error } from "@/components/pages/form-error";

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

interface SignUpValues {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
}

export function SignUp() {
    const [form, setForm] = useState<SignUpValues>();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<SignUpValues>();
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const result = signUpSchema.safeParse({
            firstName: form?.firstName,
            lastName: form?.lastName,
            email: form?.email,
            password: form?.password
        })

        if (!result.success) {
            return setErrors({
                firstName: result.error.format().firstName?._errors?.join(', ') || "",
                lastName: result.error.format().lastName?._errors?.join(', ') || "",
                email: result.error.format().email?._errors?.join(', ') || "",
                password: result.error.format().password?._errors?.join(', ') || ""
            });
        }

        try {
            setLoading(true);
            const response = await axios.post("/api/auth/sign-up", {
                firstName: form?.firstName,
                lastName: form?.lastName,
                email: form?.email,
                password: form?.password
            });

            useToast(response?.data);
            router.push("/auth/sign-in");
        } catch (error) {
            // @ts-ignore
            useToast({ success: false, message: error?.response?.data?.message || "Error while creating account." });
        } finally {
            setLoading(false);
        }
    }

    return <>
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-y-2">
                <div className="flex flex-col gap-2 md:flex-row">
                    <div>
                        <Input
                            type="text"
                            value={form?.firstName}
                            placeholder="Enter your first name"
                            onChange={(e) => setForm(() => ({ ...form, firstName: e.target.value }))}
                        />
                        <Error message={errors?.firstName} />
                    </div>
                    <div>
                        <Input
                            type="text"
                            value={form?.lastName}
                            placeholder="Enter your last name"
                            onChange={(e) => setForm(() => ({ ...form, lastName: e.target.value }))}
                        />
                        <Error message={errors?.lastName} />
                    </div>
                </div>
                <div>
                    <Input
                        type="email"
                        value={form?.email}
                        placeholder="Enter your email address"
                        onChange={(e) => setForm(() => ({ ...form, email: e.target.value }))}
                    />
                    <Error message={errors?.email} />
                </div>
                <div className="relative">
                    <div>
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={form?.password}
                            name="password"
                            placeholder="Enter your password"
                            onChange={(e) => setForm(() => ({ ...form, password: e.target.value }))}
                        />
                        <Error message={errors?.password} />
                    </div>
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
                </div>
            </div>
            <Button disabled={loading} variant={"default"} className="w-full mt-3">
                {loading ? "Processing..." : "Click to Sign Up"}
            </Button>
        </form>
    </>
}

interface SignInValues {
    email?: string;
    password?: string;
}

export function SignIn() {
    const [form, setForm] = useState<SignInValues>();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<SignInValues>();
    const [loading, setLoading] = useState<boolean>(false);

    const origin = useOrigin();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const result = signInSchema.safeParse({
            email: form?.email,
            password: form?.password
        })

        if (!result.success) {
            return setErrors({
                email: result.error.format().email?._errors?.join(', ') || "",
                password: result.error.format().password?._errors?.join(', ') || ""
            });
        }

        try {
            setLoading(true);
            const response = await signIn('credentials', {
                email: form?.email,
                password: form?.password,
                callbackUrl: origin,
                redirect: false
            });

            if (response?.error) {
                return useToast({ success: false, message: "Invalid credentials." });
            }

            useToast({ success: true, message: "Signed in successfully." });
            router.refresh();
            router.push("/");
        } catch (error) {
            useToast({ success: false, message: "Error while authenticating." });
        } finally {
            setLoading(false);
        }
    }

    return <>
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-y-2">
                <div>
                    <Input
                        type="email"
                        value={form?.email}
                        placeholder="Enter your email address"
                        onChange={(e) => setForm(() => ({ ...form, email: e.target.value }))}
                    />
                    <Error message={errors?.email} />
                </div>
                <div className="relative">
                    <div>
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={form?.password}
                            name="password"
                            placeholder="Enter your password"
                            onChange={(e) => setForm(() => ({ ...form, password: e.target.value }))}
                        />
                        <Error message={errors?.password} />
                    </div>
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
                </div>
            </div>
            <Button disabled={loading} variant={"default"} className="w-full mt-3">
                {loading ? "Processing..." : "Click to Sign In"}
            </Button>
        </form>
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