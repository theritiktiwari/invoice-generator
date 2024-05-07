"use client";

import Link from "next/link"
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils"

export function NavRoutes({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const { role } = props;

  const userRoutes = [
    {
      href: `/user`,
      label: 'Profile',
      active: pathname === `/user`,
    },
    {
      href: `/user/business`,
      label: 'Business Details',
      active: pathname.includes(`/user/business`)
    },
    {
      href: `/user/invoices`,
      label: 'Invoices',
      active: pathname.includes(`/user/invoices`)
    },
    {
      href: `/user/generate`,
      label: 'Generate',
      active: pathname === `/user/generate`,
    },
  ]

  const adminRoutes = [
    {
      href: `/user/manage-users`,
      label: 'Manage Users',
      active: pathname.includes(`/user/manage-users`)
    },
  ]

  const routes = userRoutes.concat((role === "ADMIN") ? adminRoutes : []);

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
};
