"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { CopyButton } from "~/components/copy-button";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

const apiKeysFormSchema = z.object({
  name: z.string(),
});

type ApiKeysFormValues = z.infer<typeof apiKeysFormSchema>;

export function ApiKeysForm() {
  const [apiKey, setApiKey] = useState<string | null>(null);

  const form = useForm<ApiKeysFormValues>({
    resolver: zodResolver(apiKeysFormSchema),
    mode: "onChange",
  });

  const router = useRouter();

  const { mutateAsync: createApiKey, isLoading: isCreatingApiKey } =
    api.apiKeys.create.useMutation({
      onSuccess: () => {
        toast.success("Your API Key has been created", {
          icon: <KeyRound className="h-4 w-4" />,
        });
      },
    });

  const handleAPiKeyCreation = async (data: ApiKeysFormValues) => {
    const apiKey = await createApiKey(data);

    setApiKey(apiKey);

    form.reset();
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleAPiKeyCreation)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your key name"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" loading={isCreatingApiKey}>
            Create API Key
          </Button>
        </form>
      </Form>

      {apiKey && (
        <Dialog
          open={!!apiKey}
          onOpenChange={() => {
            setApiKey(null);
            router.refresh();
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>API Key Created</DialogTitle>
              <DialogDescription>
                Please copy your API key.
                <b>You won't be able to see it again.</b>
              </DialogDescription>
            </DialogHeader>
            <div className="flex w-full items-center justify-between rounded-md bg-gray-100 p-4">
              <p className="font-mono font-medium text-primary">{apiKey}</p>
              <CopyButton text={apiKey} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
