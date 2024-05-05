"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export type BusinessColumn = {
  id: string;
  businessName: string;
  createdAt: string;
}

export const columns: ColumnDef<BusinessColumn>[] = [
  {
    accessorKey: "businessName",
    header: "Business Name",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    header: "Actions",
    cell: ({ row }) => <Link href={`/user/business/${row.original.id}`}><Button variant="outline">
      View More <ChevronRight className="ml-2 h-4 w-4" />
    </Button></Link>
  },
];
