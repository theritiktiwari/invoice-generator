"use client"

import * as z from "zod"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Edit, Eye, Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { addBusinessDetails, updateBusinessDetails, deleteBusinessDetails } from "@/functions/business";
import { BusinessInterface } from "@/models/index";
import { businessSchema } from "@/schemas/businessSchema"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { useToast } from "@/components/ui/toast"
import ImageUpload from "@/components/ui/image-upload"
import { useSession } from "next-auth/react"

interface BusinessFormProps {
  initialData: BusinessInterface | null;
};

export const BusinessForm = ({ initialData }: BusinessFormProps) => {
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

  const title = 'Business details';
  const description = state === "view" ? "See your business details." : (initialData ? 'Edit the business details.' : 'Add new business details.');
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<z.infer<typeof businessSchema>>({
    resolver: zodResolver(businessSchema),
    defaultValues: initialData || {
      businessName: "",
      businessLogo: "",
      businessEmail: "",
      businessWebsite: "",
      businessGST: "",
      businessPAN: "",
      businessAddress: {
        address1: "",
        address2: "",
        city: "",
        state: "",
        pincode: ""
      },
      businessSignature: "",
      paymentDetails: {
        accountNumber: "",
        ifscCode: "",
        bankName: "",
        upiId: ""
      },
      mailCredentials: {
        userEmail: "",
        userPassword: ""
      }
    },
  });

  async function onSubmit(data: z.infer<typeof businessSchema>) {
    try {
      setLoading(true);
      let userId = session?.user?._id;
      let response;
      if (initialData) {
        console.log("[EDIT]", data);
        //@ts-ignore
        response = await updateBusinessDetails({ data, userId, id: initialData._id });
      } else {
        //@ts-ignore
        response = await addBusinessDetails({ data, userId });
      }
      router.refresh();
      router.push(`/user/business`);
      useToast(response!);
    } catch (error: any) {
      useToast({ success: false, message: 'Something went wrong.' })
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      const response = await deleteBusinessDetails({ id: initialData?._id, userId: session?.user?._id });
      router.refresh();
      router.push(`/user/business`);
      useToast(response);
    } catch (error: any) {
      useToast({ success: false, message: 'Something went wrong.' })
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
              name="businessName"
              control={form.control}
              disabled={state === "view"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter your business name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="businessLogo"
              control={form.control}
              disabled={state === "view"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Logo</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value || ""}
                      disabled={loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => { state !== "view" && field.onChange('') }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="businessEmail"
              control={form.control}
              disabled={state === "view"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Email</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter your business email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="businessWebsite"
              control={form.control}
              disabled={state === "view"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Website</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter your business website" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="businessGST"
              control={form.control}
              disabled={state === "view"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business GST</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter your GST Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="businessPAN"
              control={form.control}
              disabled={state === "view"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business PAN</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter your business PAN" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="businessAddress.address1"
              control={form.control}
              disabled={state === "view"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Address 1</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter your business address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="businessAddress.address2"
              control={form.control}
              disabled={state === "view"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Address 2</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter your business address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="businessAddress.city"
              control={form.control}
              disabled={state === "view"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business City</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter your business city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="businessAddress.state"
              control={form.control}
              disabled={state === "view"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business State</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter your business state" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="businessAddress.pincode"
              control={form.control}
              disabled={state === "view"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business ZIP</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter your business zip" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="businessSignature"
              control={form.control}
              disabled={state === "view"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Signature</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      disabled={loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => { state !== "view" && field.onChange('') }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="paymentDetails.accountNumber"
              control={form.control}
              disabled={state === "view"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Account</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter your bank account number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="paymentDetails.ifscCode"
              control={form.control}
              disabled={state === "view"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank IFSC</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter your bank IFSC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="paymentDetails.bankName"
              control={form.control}
              disabled={state === "view"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter your bank name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="paymentDetails.upiId"
              control={form.control}
              disabled={state === "view"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UPI ID</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter your UPI id" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="mailCredentials.userEmail"
              control={form.control}
              disabled={state === "view"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sender Email</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="mailCredentials.userPassword"
              control={form.control}
              disabled={state === "view"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sender App Password</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter email app password" {...field} />
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
