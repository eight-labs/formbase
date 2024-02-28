"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPen, FolderX } from "lucide-react";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";

const formNameSchema = z.object({
  name: z.string().min(1).optional(),
});

const enableFormSubmissionsSchema = z.object({
  enableFormSubmissions: z.boolean().default(true).optional(),
});

const enableRetentionSchema = z.object({
  enableRetention: z.boolean().default(true).optional(),
});

type FormNameSchema = z.infer<typeof formNameSchema>;
type EnableFormSubmissionsSchema = z.infer<typeof enableFormSubmissionsSchema>;
type EnableSubmissionsRetentionSchema = z.infer<typeof enableRetentionSchema>;

type FormSettingsProps = {
  form: RouterOutputs["form"]["get"];
};

export function FormSettings({ form }: FormSettingsProps) {
  const router = useRouter();

  if (!form) {
    return null;
  }

  const utils = api.useUtils();

  const { mutateAsync: deleteForm, isLoading: isDeletingForm } =
    api.form.delete.useMutation({
      onSuccess() {
        return utils.form.invalidate();
      },
    });

  const handleDeleteForm = async () => {
    try {
      await deleteForm({ id: form.id });

      router.push("/dashboard");

      toast("Your form has been deleted", {
        icon: <FolderX className="h-4 w-4" />,
      });
    } catch (e) {
      console.log(e);

      toast("Failed to delete form", {
        description: "Please try again later",
        icon: <FolderX className="h-4 w-4" />,
      });
    }
  };

  return (
    <div className="space-y-4">
      <FormName formId={form.id} name={form.title} />

      <EnableFormSubmissions
        formId={form.id}
        enableSubmissions={form.enableSubmissions}
      />

      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label className="text-base">Delete Form</Label>
          <p className="text-sm text-muted-foreground">
            Delete your form with all your submissions
          </p>
        </div>
        {/* TODO: Dialog to Confirm Deleting */}
        <Button
          type="button"
          loading={isDeletingForm}
          variant="destructive"
          onClick={handleDeleteForm}
        >
          Delete Form
        </Button>
      </div>
    </div>
  );
}

const FormName = ({ formId, name }: { formId: string; name: string }) => {
  const router = useRouter();

  const formName = useForm<FormNameSchema>({
    resolver: zodResolver(formNameSchema),
    defaultValues: {
      name,
    },
  });

  const { mutateAsync: updateFormName, isLoading: isUpdatingFormName } =
    api.form.update.useMutation();

  async function handleFormNameSubmit(data: FormNameSchema) {
    try {
      await updateFormName({
        id: formId,
        title: data.name,
      });

      toast("Your form name has been updated", {
        icon: <FolderPen className="h-4 w-4" />,
      });

      router.refresh();
    } catch {
      toast("Failed to update form name", {
        description: "Please try again later",
        icon: <FolderX className="h-4 w-4" />,
      });
    }
  }

  return (
    <Form {...formName}>
      <form onSubmit={formName.handleSubmit(handleFormNameSubmit)}>
        <FormField
          control={formName.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Form Name</FormLabel>
                <FormDescription>This is the name of your form</FormDescription>
              </div>
              <FormControl>
                <div className="flex gap-2">
                  <Input className="w-[250px]" {...field} />
                  <Button
                    loading={isUpdatingFormName}
                    type="submit"
                    variant="default"
                  >
                    Save
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

const EnableFormSubmissions = ({
  formId,
  enableSubmissions,
}: {
  formId: string;
  enableSubmissions: boolean;
}) => {
  const router = useRouter();

  const enableSubmissionsForm = useForm<EnableFormSubmissionsSchema>({
    resolver: zodResolver(enableRetentionSchema),
    defaultValues: {
      enableFormSubmissions: enableSubmissions,
    },
  });

  const { mutateAsync: updateForm, isLoading: isUpdatingForm } =
    api.form.update.useMutation();

  async function handleEnableSubmissionsRetentionSubmit(
    data: EnableFormSubmissionsSchema,
  ) {
    try {
      await updateForm({
        id: formId,
        enableSubmissions: data.enableFormSubmissions,
      });

      toast(
        data.enableFormSubmissions
          ? "Your form is now accepting submissions"
          : "Your form is no longer accepting submissions",
        {
          icon: <FolderPen className="h-4 w-4" />,
        },
      );

      router.refresh();
    } catch {
      toast("Failed to update form", {
        description: "Please try again later",
        icon: <FolderX className="h-4 w-4" />,
      });
    }
  }

  return (
    <Form {...enableSubmissionsForm}>
      <FormField
        control={enableSubmissionsForm.control}
        name="enableFormSubmissions"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Enable Form Submissions
              </FormLabel>
              <FormDescription>
                Turn off this option to prevent your form from accepting new
                submissions
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(isChecked) => {
                  field.onChange(isChecked);
                  handleEnableSubmissionsRetentionSubmit({
                    enableFormSubmissions: isChecked,
                  });
                }}
                disabled={isUpdatingForm}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </Form>
  );
};
