import { Table, TableBody, TableCaption, TableCell, TableRow } from "@/components/ui/table"
import { getSession } from "@/helper/getSession";
import { EditName } from "@/components/edit-profile";
import { getName } from "@/functions/user";

export default async function Page() {
    const session = await getSession();
    const userName = await getName(session?.user?._id);

    return (
        <>
            <div>
                <Table className="md:w-[50%] w-[95%] mx-auto mt-20">
                    <TableCaption>Please Login again for better user experience.</TableCaption>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-bold">Full Name</TableCell>
                            <TableCell className="md:pl-24">{userName?.firstName} {userName?.lastName}</TableCell>
                            <TableCell className="md:pl-24">
                                <EditName
                                    firstName={userName?.firstName}
                                    lastName={userName?.lastName || ""}
                                    id={session?.user?._id}
                                />
                            </TableCell>

                        </TableRow>
                        <TableRow>
                            <TableCell className="font-bold">Email</TableCell>
                            <TableCell className="md:pl-24">{session?.user?.email}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-bold">Role</TableCell>
                            <TableCell className="md:pl-24 font-bold">{session?.user?.role}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-bold">Status</TableCell>
                            <TableCell className="md:pl-24 font-bold uppercase">
                                {session?.user?.isVerified ? <span className="text-success">
                                    Verified
                                </span> : <span className="text-destructive">Not Verified</span>}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div >
        </>
    );
}
