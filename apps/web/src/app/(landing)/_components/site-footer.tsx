import { FunctionSquare } from 'lucide-react';

import { cn } from '@formbase/ui/utils/cn';

import { ThemeToggle } from './theme-toggle';

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="mx-4 flex items-center justify-between py-10 sm:container md:h-24 md:py-0">
        <div className="flex items-center gap-4 px-8 md:gap-2 md:px-0">
          <FunctionSquare className="h-5 w-5 sm:mr-2" />
          <p className="text-center text-sm leading-loose md:text-left">
            Built by{' '}
            <a
              href="https://github.com/eight-labs"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Eight Labs
            </a>
          </p>
        </div>

        <ThemeToggle />
      </div>
    </footer>
  );
}
