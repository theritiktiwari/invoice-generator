"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type InvoiceColumn = {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  businessName: string;
  paymentMode: string;
}

export const columns: ColumnDef<InvoiceColumn>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "Invoice Number",
  },
  {
    accessorKey: "invoiceDate",
    header: "Invoice Date",
  },
  {
    accessorKey: "businessName",
    header: "Business Name",
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
