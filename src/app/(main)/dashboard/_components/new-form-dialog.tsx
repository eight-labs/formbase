"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { toast } from "sonner";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { RouterOutputs } from "~/trpc/shared";

type CreateFormDialogProps = {
  setOptimisticForms: (action: {
    action: "add" | "delete" | "update";
    post: RouterOutputs["form"]["userForms"][number];
  }) => void;
};

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "Form title is required.",
  }),
  returnUrl: z.string().optional(),
});

export function CreateFormDialog() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      returnUrl: "",
    },
  });
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [isCreatePending, startCreateTransaction] = React.useTransition();

  const { mutateAsync: createNewForm } = api.form.create.useMutation();

  const createPost = (data: z.infer<typeof FormSchema>) => {
    startCreateTransaction(async () => {
      await createNewForm(
        {
          title: data.name,
        },
        {
          onSuccess: ({ id }) => {
            toast.success("New form created");
            router.refresh();

            setTimeout(() => {
              router.push(`/form/${id}`);
            }, 100);
          },
          onError: () => {
            toast.error("Failed to create form");
          },
        },
      );
    });
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("data", data);

    createPost(data);

    setShowDialog(false);
  }

  return (
    <Form {...form}>
      <div className="w-2/3 space-y-6">
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">New Form</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Form</DialogTitle>
            </DialogHeader>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="A new form" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="returnUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Return URL</FormLabel>
                  <FormControl>
                    <Input placeholder="http://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button onClick={form.handleSubmit(onSubmit)}>Create Form</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Form>
  );
}
