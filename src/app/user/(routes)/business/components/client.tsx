"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, BusinessColumn } from "./columns";

interface BusinessClientProps {
  data: BusinessColumn[];
}

export const BusinessClient: React.FC<BusinessClientProps> = ({
  data
}) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Business Details (${data.length})`} description="Manage business details for your customers." />
        <Button onClick={() => router.push(`/user/business/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="businessName" columns={columns} data={data} />
    </>
  );
};
