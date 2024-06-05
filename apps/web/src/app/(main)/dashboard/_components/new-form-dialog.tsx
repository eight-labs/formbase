'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@formbase/ui/primitives/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@formbase/ui/primitives/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@formbase/ui/primitives/form';
import { Input } from '@formbase/ui/primitives/input';

import { api } from '~/lib/trpc/react';

const FormSchema = z.object({
  name: z.string().min(1, {
    message: 'Form title is required.',
  }),
  returnUrl: z.string().optional(),
  description: z.string().optional(),
  keys: z.array(z.string()).optional(),
});

export function CreateFormDialog() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      description: '',
      returnUrl: '',
      keys: [''],
    },
  });
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [_isCreatePending, startCreateTransaction] = useTransition();

  const { mutateAsync: createNewForm } = api.form.create.useMutation();

  const createPost = (data: z.infer<typeof FormSchema>) => {
    startCreateTransaction(async () => {
      await createNewForm(
        {
          title: data.name,
          description: data.description,
          returnUrl: data.returnUrl,
        },
        {
          onSuccess: ({ id }) => {
            toast.success('New form created');
            router.refresh();

            setTimeout(() => {
              router.push(`/form/${id}`);
            }, 100);
          },
          onError: () => {
            toast.error('Failed to create form');
          },
        },
      );
    });
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    createPost(data);

    setShowDialog(false);
  }

  return (
    <Form {...form}>
      <div className="space-y-6">
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">New Form</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Form</DialogTitle>
            </DialogHeader>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="returnUrl"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel>Return URL</FormLabel>
                  {/* <FormDescription className="text-[11px]">
                    Where should users be redirected after form submission?
                  </FormDescription> */}
                  <FormControl>
                    <Input placeholder="http://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                className="mt-2 w-full"
              >
                Create Form
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Form>
  );
}
