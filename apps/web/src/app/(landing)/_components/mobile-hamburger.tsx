"use client";

import { Menu, X } from "lucide-react";

import { Button } from "src/components/ui/button";

export interface HamburgerMenuProps {
  isMenuOpen: boolean;
  onToggleMenuOpen?: () => void;
}

export const HamburgerMenu = ({
  isMenuOpen,
  onToggleMenuOpen,
}: HamburgerMenuProps) => {
  return (
    <div className="flex md:hidden">
      <Button
        variant="outline"
        className="z-20 w-10 border-transparent p-0"
        onClick={onToggleMenuOpen}
      >
        {isMenuOpen ? <X /> : <Menu />}
      </Button>
    </div>
  );
};
