import Link from "next/link";
import { type User } from "lucia";
import { UserDropdown } from "~/app/(main)/_components/user-dropdown";
import { DashboardIcon } from "@radix-ui/react-icons";

export const Header = ({ user }: { user: User }) => {
  return (
    <header className="sticky top-0 border-b bg-background/80 p-2">
      <div className="container flex items-center gap-2 px-2 py-2 lg:px-4">
        <Link
          className="flex items-center justify-center text-lg font-medium"
          href="/"
        >
          <DashboardIcon className="mr-2 h-5 w-5" />
          Dashboard
        </Link>

        <UserDropdown
          email={user.email}
          avatar={user.avatar}
          className="ml-auto"
        />
      </div>
    </header>
  );
};
