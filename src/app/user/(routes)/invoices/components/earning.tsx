import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { setCurrency } from "@/lib/utils";

export default function Earning({ invoices }: { invoices: any }) {
    const amounts = Object.values(invoices).map((item: any) => item.productDetails.reduce((acc: number, item: { quantity: number; price: number; }) => acc + (item.quantity * item.price), 0));
    const totalAmount = amounts.reduce((acc: number, item: number) => acc + item, 0);

    const formatter = setCurrency(invoices[0]?.currency);

    return (<>
        <div className="flex items-center justify-between">
            <Heading title={`Total Earning`} description="This is the amount from your invoices." />
            <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold">
                    {formatter.format(totalAmount) ?? 0}
                </div>
            </div>
        </div>
        <Separator />
    </>);
}