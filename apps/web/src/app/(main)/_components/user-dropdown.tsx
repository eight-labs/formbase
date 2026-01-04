'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';

import { signOut, useSession } from '@formbase/auth/client';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@formbase/ui/primitives/alert-dialog';
import { Button } from '@formbase/ui/primitives/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@formbase/ui/primitives/dropdown-menu';

import { LoadingButton } from '~/components/loading-button';

export const UserDropdown = ({ className }: { className?: string }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) {
    return null;
  }
  const avatarSeed = user.email ?? user.id;
  const avatarSrc =
    user.image && user.image.trim().length > 0
      ? user.image
      : `https://source.boringavatars.com/marble/60/${encodeURIComponent(
          avatarSeed,
        )}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className ?? ""}>
        {/* eslint @next/next/no-img-element:off */}
        <img
          src={avatarSrc}
          alt="Avatar"
          className="block h-8 w-8 rounded-full leading-none"
          width={64}
          height={64}
        ></img>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[250px]">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-muted-foreground">
            {user.email}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer text-muted-foreground"
            asChild
          >
            <Link href="/dashboard">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-muted-foreground"
            asChild
          >
            <Link href="/dashboard/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-muted-foreground"
            asChild
          >
            <Link href="/onboarding">Onboarding</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer text-muted-foreground">
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => {
                  setTheme('light');
                }}
              >
                Light
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setTheme('dark');
                }}
              >
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setTheme('system');
                }}
              >
                System
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0">
            <SignoutConfirmation />
          </DropdownMenuLabel>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SignoutConfirmation = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignout = async () => {
    setIsLoading(true);
    try {
      const { error } = await signOut();
      if (error) {
        throw new Error(error.message);
      }
      toast('Signed out successfully');
      window.location.href = '/';
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message, {
          icon: (
            <ExclamationTriangleIcon className="h-4 w-4 text-destructive" />
          ),
        });
      }
    } finally {
      setOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        className="px-2 py-1.5 text-sm text-muted-foreground outline-hidden"
        asChild
      >
        <button>Sign out</button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-xs">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Sign out from Formbase?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will be redirected to the home page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <LoadingButton loading={isLoading} onClick={handleSignout}>
            Continue
          </LoadingButton>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
