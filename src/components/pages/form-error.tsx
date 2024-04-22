import { CardDescription } from "@/components/ui/card";

export function Error({ message }: { message: string | undefined }) {
    return (
        <CardDescription className="text-sm px-1 mt-1 text-destructive">
            {message}
        </CardDescription>
    );
}