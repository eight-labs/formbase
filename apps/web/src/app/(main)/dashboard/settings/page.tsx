import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Separator } from "src/components/ui/separator";
import { env } from "@formbase/env";
import { validateRequest } from "@formbase/lib/auth/validate-request";

import { ProfileForm } from "./profile-form";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Settings | Formbase",
  description: "Manage your account settings",
};

export default async function SettingsPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Manage your profile settings.
        </p>
      </div>
      <Separator />
      <ProfileForm user={user} />
    </div>
  );
}
