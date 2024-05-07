"use client"

import * as z from "zod"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Edit, Eye, Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import { addUserDetails, updateUserDetails, deleteUserDetails } from "@/functions/user"
import { UserInterface } from "@/models/index";
import { userSchema } from "@/schemas/userSchema"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { useToast } from "@/components/ui/toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface UserFormProps {
  initialData: UserInterface | null;
};

export const UserForm = ({ initialData }: UserFormProps) => {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState("new");

  useEffect(() => {
    if (params?.id == "new") setState("new");
    else setState("view");
  }, [params, router]);

  const title = 'User details';
  const description = state === "view" ? "See the user details." : (initialData ? 'Edit the user details.' : 'Add new user details.');
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData || {
      role: "USER",
      isVerified: true,
      verifyCode: Math.floor(100000 + Math.random() * 900000).toString()
    },
  });

  async function onSubmit(data: z.infer<typeof userSchema>) {
    try {
      setLoading(true);
      let adminId = session?.user?._id;
      let response;
      if (initialData) {
        response = await updateUserDetails({ data, adminId, userId: initialData._id });
      } else {
        response = await addUserDetails({ data, adminId });
      }
      router.refresh();
      router.push(`/user/manage-users`);
      useToast(response!);
    } catch (error: any) {
      useToast({ success: false, message: error?.message || 'Something went wrong.' })
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      const response = await deleteUserDetails({ userId: initialData?._id, adminId: session?.user?._id });
      router.refresh();
      router.push(`/user/manage-users`);
      useToast(response);
    } catch (error: any) {
      useToast({ success: false, message: error?.message || 'Something went wrong.' })
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <div className="flex gap-2">
            <Button
              disabled={state === "view"}
              variant={"default"}
              size="sm"
              onClick={() => setState("view")}
            >
              <Eye className="h-4 w-4" />
            </Button>

            <Button
              disabled={state === "edit"}
              variant={"default"}
              size="sm"
              onClick={() => setState("edit")}
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Button
              disabled={loading}
              variant="destructive"
              size="sm"
              onClick={() => setOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-4 gap-8">
            <FormField
              name="fullName.firstName"
              control={form.control}
              disabled={state === "view"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter the first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="fullName.lastName"
              control={form.control}
              disabled={state === "view"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter the last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              disabled={state === "view"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter the email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              disabled={state === "view"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter the password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="role"
              control={form.control}
              disabled={state === "view"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={state === "view"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={"ADMIN"}>ADMIN</SelectItem>
                      <SelectItem value={"USER"}>USER</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="isVerified"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      disabled={state === "view"}
                      checked={field.value as boolean}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Status
                    </FormLabel>
                    <FormDescription>
                      {field.value ? "The user is verified." : "The user is not verified."}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              name="verifyCode"
              control={form.control}
              disabled={state === "view"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter the verification code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


          </div>
          {state !== "view" && <Button type="submit" disabled={loading} className="ml-auto mt-3">
            {loading ? "Processing..." : action}
          </Button>}
        </form>
      </Form>
    </>
  );
};
