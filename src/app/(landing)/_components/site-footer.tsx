import { FunctionSquare } from "lucide-react";

import { cn } from "~/lib/utils";

import { ThemeToggle } from "./theme-toggle";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <FunctionSquare className="mr-2 h-5 w-5" />{" "}
          <p className="text-center text-sm leading-loose md:text-left">
            Built by{" "}
            <a
              href="https://github.com/eight-labs"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              eight-labs
            </a>
          </p>
        </div>

        <ThemeToggle />
      </div>
    </footer>
  );
}
