import Link from 'next/link';

import { type User } from '@formbase/auth';

import { Logo } from '../../(auth)/_components/logo';
import { UserDropdown } from './user-dropdown';

const routes = [{ name: 'Dashboard', href: '/dashboard' }] as const;

export const Header = ({ user }: { user: User }) => {
  return (
    <header className="top-0 border-b py-2">
      <div className="container flex items-center gap-2 px-2 py-2 lg:px-4">
        <Link
          className="text flex items-center justify-center font-semibold"
          href={user.id ? '/dashboard' : '/'}
        >
          <Logo className="mr-1.5 h-6 w-6" /> Formbase
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

        <UserDropdown className="ml-auto" />
      </div>
    </header>
  );
};
