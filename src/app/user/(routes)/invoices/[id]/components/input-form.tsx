"use client"

import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { updateInvoice } from "@/functions/invoice";
import { BusinessInterface } from "@/models/index";
import { invoiceSchema } from "@/schemas/invoiceSchema";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { useToast } from "@/components/ui/toast";
import { Calendar } from "@/components/ui/calendar";

interface EditInvoiceProps {
  business: BusinessInterface[];
  initialData: any;
}

export function EditInvoice({ business, initialData }: EditInvoiceProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);

  const currencyOptions = [
    { label: "USD", value: "USD" },
    { label: "INR", value: "INR" },
    { label: "EUR", value: "EUR" },
    { label: "GBP", value: "GBP" },
    { label: "AUD", value: "AUD" },
  ];

  const businessOptions = business?.map((item: BusinessInterface) => ({
    label: item.businessName,
    value: item._id,
  }));

  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      businessId: initialData?.businessId?._id,
      invoiceNumber: initialData?.invoiceNumber,
      invoiceDate: new Date(initialData?.invoiceDate),
      currency: initialData?.currency,
      discount: initialData?.discount,
      billingAddress: initialData?.billingAddress,
      paymentMode: initialData?.paymentMode,
      totalItems: initialData?.productDetails?.length,
      productDetails: initialData?.productDetails,
    }
  });

  async function onSubmit(data: z.infer<typeof invoiceSchema>) {
    try {
      setLoading(true);
      let userId = session?.user?._id;
      // @ts-ignore
      let response = await updateInvoice({ data, userId, id: initialData._id });
      router.refresh();
      router.push(`/user/invoices`);
      useToast(response!);
    } catch (error: any) {
      useToast({ success: false, message: 'Something went wrong.' })
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={"Invoice Details"} description={"Edit an invoice for your customer."} />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-4 gap-8">
            <FormField
              name="businessId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose Business</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the business" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {businessOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="invoiceNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Number</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter the invoice number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="invoiceDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date <= new Date("2020-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="currency"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="discount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="Enter the discount value"
                      {...field}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        field.onChange(isNaN(value) ? '' : value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="billingAddress.address1"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Address 1</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter the billing address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="billingAddress.address2"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Address 2</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter the billing address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="billingAddress.city"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing City</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter the billing city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="billingAddress.state"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing State</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter the billing state" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="billingAddress.pincode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing ZIP</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter the billing zip" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="paymentMode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mode of Payment</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={"UPI"}>UPI</SelectItem>
                      <SelectItem value={"NET_BANKING"}>Net Banking</SelectItem>
                      <SelectItem value={"COD"}>Cash on Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="totalItems"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Items</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      disabled={loading}
                      placeholder="Enter the number of total items"
                      {...field}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        field.onChange(isNaN(value) ? '' : value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {Array.from({ length: form.getValues("totalItems") }).map((_, index) => (<>
            {index === 0 && <Separator />}
            <div key={index} className="md:grid md:grid-cols-3 gap-8">
              <FormField
                name={`productDetails.${index}.name`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item {index + 1} Name</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Enter item name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name={`productDetails.${index}.quantity`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={loading}
                        placeholder="Enter item quantity"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(isNaN(value) ? '' : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name={`productDetails.${index}.price`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={loading}
                        placeholder="Enter item price"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(isNaN(value) ? '' : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>))}

          <Button type="submit" disabled={loading} className="ml-auto mt-3">
            {loading ? "Updating..." : "Save changes"}
          </Button>
        </form>
      </Form >
    </>
  );
};