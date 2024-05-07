"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, UsersColumn } from "./columns";

interface UsersClientProps {
  data: UsersColumn[];
}

export const UsersClient: React.FC<UsersClientProps> = ({
  data
}) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Users (${data.length})`} description="Manage users for your application." />
        <Button onClick={() => router.push(`/user/manage-users/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable placeholder={"Search by full name"} searchKey="fullName" columns={columns} data={data} />
    </>
  );
};
