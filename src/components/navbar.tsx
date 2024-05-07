import { NavRoutes } from "@/components/nav-routes";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignOut } from "@/components/signout";
import { getSession } from "@/helper/getSession";

const Navbar = async () => {
  const session = await getSession();
  return (
    <div className="border-b px-8 hideOnPrinting">
      <div className="flex h-16 items-center">
        <NavRoutes
          role={session?.user?.role} />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <SignOut />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
