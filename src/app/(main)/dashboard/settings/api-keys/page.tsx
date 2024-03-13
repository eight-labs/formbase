import { type Metadata } from "next";
import { redirect } from "next/navigation";

import { Separator } from "~/components/ui/separator";
import { env } from "~/env";
import { validateRequest } from "~/lib/auth/validate-request";
import { api } from "~/trpc/server";

import { ApiKeyCard } from "./api-key-card";
import { ApiKeysForm } from "./api-keys-form";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "API Keys",
};

export default async function SettingsPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/signin");
  }

  const userKeys = await api.apiKeys.getUserKeys.query();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">API Keys</h3>
        <p className="text-sm text-muted-foreground">
          Generate and manage your API keys
        </p>
      </div>
      <Separator />
      <div>{userKeys ? <ApiKeyCard apiKey={userKeys} /> : <ApiKeysForm />}</div>
    </div>
  );
}
