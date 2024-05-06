import { Poppins } from "next/font/google";
import { format } from "date-fns";
import Image from "next/image";
import { Globe, Mail } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { setCurrency } from "@/lib/utils";
import { getSession } from "@/helper/getSession";

import { SendInvoice } from "./send-invoice";
import { PrintInvoice } from "./print-invoice";

import logo from "/public/logo.png";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"]
});

export async function ViewInvoice({ data }: { data: any }) {
  const session = await getSession();
  const formatter = setCurrency(data?.currency);
  const totalAmount = data?.productDetails.reduce((acc: number, item: { quantity: number; price: number; }) => acc + (item.quantity * item.price), 0);
  return (
    <>
      <div className="flex items-center justify-between hideOnPrinting">
        <Heading title={`Invoice ${data?.invoiceNumber}`} description={"This is your invoice for your customer."} />
        <div className="flex gap-2">
          {session?.user?.role === "ADMIN" && <SendInvoice />}
          {((session?.user?.role === "USER") &&
            (data?.businessId?.mailCredentials?.userPassword)) &&
            <SendInvoice />}
          <PrintInvoice id={data?.invoiceNumber} />
        </div>
      </div>
      <Separator className="hideOnPrinting" />
      <section className={`${poppins.className} font-light md:w-[75%] mx-auto colorOnPrinting widthOnPrinting`}>
        <div className="flex justify-between items-center my-10">
          <div className="w-[50px] h-[50px]">
            <Image
              src={data?.businessId?.businessLogo || logo.src}
              alt={data?.businessId?.businessName}
              width={500}
              height={500}
              className="rounded-lg"
            />
          </div>
          <div>
            <p><span className="font-bold">{"Date: "}</span> {format(new Date(data?.invoiceDate), "dd MMM yyyy")}</p>
          </div>
        </div>

        <div className="flex justify-center items-center flex-col my-10">
          <h1 className="text-5xl font-extrabold text-invoice">Invoice</h1>
          <p className="text-lg mt-2">{`No. ${data?.invoiceNumber}`}</p>
        </div>

        <div className="flex justify-between items-start my-10">
          <div>
            <h3 className="text-xl font-bold">Billed To:</h3>
            <p className="font-medium">{data?.customerName}</p>
            <p>{data?.billingAddress?.address1}</p>
            <p>{data?.billingAddress?.address2}</p>
            <p>{`
              ${data?.billingAddress?.city}, 
              ${data?.billingAddress?.state}, 
              ${data?.billingAddress?.pincode}
            `}</p>
          </div>

          <div>
            <h3 className="text-xl font-bold">From:</h3>
            <p className="font-medium">{data?.businessId?.businessName}</p>
            <p>{data?.businessId?.businessAddress?.address1}</p>
            <p>{data?.businessId?.businessAddress?.address2}</p>
            <p>{`
              ${data?.businessId?.businessAddress?.city}, 
              ${data?.businessId?.businessAddress?.state}, 
              ${data?.businessId?.businessAddress?.pincode}
            `}</p>
          </div>
        </div>

        <div className="flex justify-between items-center my-10">
          <Table>
            <TableHeader className="bg-invoiceBG">
              <TableRow>
                <TableHead className="border-r-2 border-invoiceBG-foreground text-invoice font-bold text-lg text-left">Item</TableHead>
                <TableHead className="border-r-2 border-invoiceBG-foreground text-invoice font-bold text-lg text-center">Quantity</TableHead>
                <TableHead className="border-r-2 border-invoiceBG-foreground text-invoice font-bold text-lg text-center">Price</TableHead>
                <TableHead className="text-invoice font-bold text-lg text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.productDetails.map((item: { name: string; quantity: number; price: number; }) => (
                <TableRow key={data?.productDetails.indexOf(item)}>
                  <TableCell className="border-r-2 border-invoiceBG-foreground text-left">{item.name}</TableCell>
                  <TableCell className="border-r-2 border-invoiceBG-foreground text-center">{item.quantity < 10 ? `0${item.quantity}` : item.quantity}</TableCell>
                  <TableCell className="border-r-2 border-invoiceBG-foreground text-center">{formatter.format(item.price)}</TableCell>
                  <TableCell className="text-right">{formatter.format(item.quantity * item.price)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-invoiceBG">
              <TableRow>
                <TableCell className="text-invoice font-bold text-lg" colSpan={3}>Total Amount</TableCell>
                <TableCell className="text-invoice font-bold text-lg text-right">{formatter.format(totalAmount)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        <div className="flex justify-between items-end my-10">
          <div className="space-y-1">
            <p><span className="font-bold">{`Name: `}</span> {data?.businessId?.businessName}</p>
            {data?.businessId?.businessGST && <p><span className="font-bold">{`GSTIN: `}</span> {data?.businessId?.businessGST}</p>}
            {data?.businessId?.businessPAN && <p><span className="font-bold">{`PAN: `}</span> {data?.businessId?.businessPAN}</p>}
            {data?.businessId?.paymentDetails?.bankName && <p><span className="font-bold">{`Bank Name: `}</span> {data?.businessId?.paymentDetails?.bankName}</p>}
            {data?.businessId?.paymentDetails?.ifscCode && <p><span className="font-bold">{`IFSC: `}</span> {data?.businessId?.paymentDetails?.ifscCode}</p>}
            {data?.businessId?.paymentDetails?.accountNumber && <p><span className="font-bold">{`Account Number: `}</span> {data?.businessId?.paymentDetails?.accountNumber}</p>}
            {data?.businessId?.paymentDetails?.upiId && <p><span className="font-bold">{`UPI ID: `}</span> {data?.businessId?.paymentDetails?.upiId}</p>}

            <p><span className="font-bold">{`Payment Method: `}</span>
              {data?.paymentMode === "NET_BANKING" ? "Net Banking" :
                data?.paymentMode === "COD" ? "Cash On Delivery" :
                  data?.paymentMode}
            </p>
          </div>

          <div className="flex flex-col justify-center items-center gap-3">
            <div className="w-[150px]">
              <Image
                src={data?.businessId?.businessSignature}
                alt={data?.businessId?.businessName}
                width={900}
                height={900}
                className="rounded-lg dark:invert imageOnPrinting"
              />
            </div>
            <p className="font-bold">Authorized Signatory</p>
          </div>
        </div>

        <div className="flex justify-center items-center flex-col mt-10">
          <p>Thank you for choosing us!</p>

          <div className="flex w-full justify-between items-center my-10">
            {data?.businessId?.businessWebsite && <a
              className="flex items-center text-primary gap-1"
              href={`https://${data?.businessId?.businessWebsite}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Globe className="w-4 h-4" />{data?.businessId?.businessWebsite}
            </a>}
            {data?.businessId?.businessEmail && <a
              className="flex items-center text-primary gap-1"
              href={`mailto:${data?.businessId?.businessEmail}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Mail className="w-4 h-4" />{data?.businessId?.businessEmail}
            </a>}
          </div>

          <p>This invoice is generated by {" "}
            <a
              className="text-primary hover:underline font-medium"
              href={process.env.NEXTAUTH_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {process.env.APP_NAME}
            </a>.
          </p>
        </div>

      </section>
    </>
  );
};