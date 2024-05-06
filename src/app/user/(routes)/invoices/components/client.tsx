"use client";

import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, InvoiceColumn } from "./columns";

interface InvoiceClientProps {
  data: InvoiceColumn[];
}

export const InvoiceClient: React.FC<InvoiceClientProps> = ({
  data
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Invoices (${data.length})`} description="Manage your invoices for your customers." />
      </div>
      <Separator />
      <DataTable searchKey="invoiceNumber" columns={columns} data={data} />
    </>
  );
};
