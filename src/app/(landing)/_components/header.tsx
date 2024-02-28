import type { User as LuciaUser } from "lucia";
import { FunctionSquare } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { APP_TITLE } from "~/lib/constants";

const routes = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/#features" },
] as const;

type LandingHeaderProps = {
  user: LuciaUser | null;
};

export const Header = ({ user }: LandingHeaderProps) => {
  const isLoggedIn = user !== null;

  return (
    <header className="py-4">
      <div className="container flex items-center gap-2 px-4 md:p-0">
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
        <div className="ml-auto">
          {isLoggedIn ? (
            <Button asChild variant={"secondary"}>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <Button asChild variant={"secondary"}>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
