import Link from "next/link";
import { UserDropdown } from "~/app/(main)/_components/user-dropdown";
import { FunctionSquare } from "lucide-react";
import { APP_TITLE } from "@/lib/constants";
import type { User } from "~/server/db/schema";

const routes = [{ name: "Dashboard", href: "/dashboard" }] as const;

export const Header = ({ user }: { user: User }) => {
  const isLoggedIn = user !== null;

  return (
    <header className="sticky top-0 border-b bg-background/80 py-2">
      <div className="container flex items-center gap-2 px-2 py-2 lg:px-4">
        <Link
          className="text flex items-center justify-center font-medium"
          href={isLoggedIn ? "/dashboard" : "/"}
        >
          <FunctionSquare className="mr-2 h-5 w-5" /> {APP_TITLE}
        </Link>

        <nav className="ml-8 hidden gap-4 sm:gap-6 md:flex">
          {routes.map(({ name, href }) => (
            <Link
              key={name}
              className="text-sm font-medium text-muted-foreground/70 transition-colors hover:text-muted-foreground"
              href={href}
            >
              {name}
            </Link>
          ))}
        </nav>

        <UserDropdown
          email={user.email}
          avatar={user.avatar}
          className="ml-auto"
        />
      </div>
    </header>
  );
};
