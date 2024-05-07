"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type UsersColumn = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export const columns: ColumnDef<UsersColumn>[] = [
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "email",
    header: "Email Address",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <Badge variant={row.original.role === "ADMIN" ? "default" : "outline"}>
      {row.original.role}
    </Badge>
  },
  {
    accessorKey: "isVerified",
    header: "Status",
    cell: ({ row }) => <Badge variant={row.original.isVerified ? "success" : "destructive"}>
      {row.original.isVerified ? "Verified" : "Not Verified"}
    </Badge>
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    header: "Actions",
    cell: ({ row }) => <Link href={`/user/manage-users/${row.original.id}`}><Button variant="outline">
      View More <ChevronRight className="ml-2 h-4 w-4" />
    </Button></Link>
  },
];
