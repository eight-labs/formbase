"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { RouterOutputs } from "~/trpc/shared";

import { DeleteAPIKeyModal } from "./delete-api-key-modal";

type ApiKeysProps = {
  apiKey: RouterOutputs["apiKeys"]["getUserKeys"];
};

export function ApiKeyCard({ apiKey }: ApiKeysProps) {
  return (
    <div className="text-sm underline-offset-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg capitalize">{apiKey!.name}</CardTitle>
            <DeleteAPIKeyModal apiKeyId={apiKey!.id} />
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-1">
          <p className="flex justify-between text-muted-foreground">
            Key
            <span className="font-mono font-medium text-primary">
              {apiKey!.id.slice(0, 6)}...
            </span>
          </p>
          <p className="flex justify-between text-muted-foreground">
            Created
            <span className="text-primary">
              {new Date(apiKey!.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
        </CardContent>
      </Card>
      <span className="mt-4 inline-block text-xs text-muted-foreground">
        Read more about our APIs in our{" "}
        <a className="underline" href="#">
          docs
        </a>{" "}
      </span>
    </div>
  );
}
