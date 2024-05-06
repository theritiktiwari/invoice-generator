import { NavRoutes } from "@/components/nav-routes";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignOut } from "@/components/signout";
import { getSession } from "@/helper/getSession";

const Navbar = async () => {
  const session = await getSession();
  return (
    <div className="border-b px-8">
      <div className="flex h-16 items-center">
        {/* <span className="font-bold uppercase">{process.env.APP_NAME}</span> */}
        <NavRoutes
          // className="mx-6" 
          role={session?.user?.role} />
        <div className="ml-auto flex items-center space-x-4">
          {/* <span className="font-bold">Hello {session?.user?.firstName}</span> */}
          <ThemeToggle />
          <SignOut />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
