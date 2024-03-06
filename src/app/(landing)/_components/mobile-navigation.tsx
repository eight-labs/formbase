"use client";

import { FunctionSquare } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Sheet, SheetContent } from "~/components/ui/sheet";

import { HamburgerMenu } from "./mobile-hamburger";
import { ThemeToggle } from "./theme-toggle";

export type MobileNavigationProps = {
  isMenuOpen: boolean;
  onMenuOpenChange?: (_value: boolean) => void;
};

const MobileNavigationSheet = ({
  isMenuOpen,
  onMenuOpenChange,
}: MobileNavigationProps) => {
  const handleMenuItemClick = () => {
    onMenuOpenChange?.(false);
  };

  const menuNavigationLinks = [
    {
      href: `/docs`,
      text: "Docs",
    },
  ];

  return (
    <Sheet open={isMenuOpen} onOpenChange={onMenuOpenChange}>
      <SheetContent className="flex w-full max-w-[400px] flex-col">
        <Link
          href="/"
          onClick={handleMenuItemClick}
          className="flex items-center font-medium"
        >
          <FunctionSquare className="mr-2 h-5 w-5" /> Formbase
        </Link>

        <div className="mt-8 flex w-full flex-col items-start gap-y-4">
          {menuNavigationLinks.map(({ href, text }) => (
            <Link
              key={href}
              className="text-2xl font-semibold text-foreground hover:text-foreground/80"
              href={href}
              onClick={() => handleMenuItemClick()}
            >
              {text}
            </Link>
          ))}
        </div>

        <div className="mt-auto flex w-full flex-col space-y-4 self-end">
          <div className="w-fit">
            <ThemeToggle />
          </div>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Eight Labs. All rights reserved.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export const MobileNavigation = () => {
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);

  return (
    <>
      <HamburgerMenu
        onToggleMenuOpen={() => setIsHamburgerMenuOpen((v) => !v)}
        isMenuOpen={isHamburgerMenuOpen}
      />
      <MobileNavigationSheet
        isMenuOpen={isHamburgerMenuOpen}
        onMenuOpenChange={setIsHamburgerMenuOpen}
      />
    </>
  );
};
