'use client';

import { Button } from '@formbase/ui/primitives/button';
import { Menu, X } from 'lucide-react';

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
