"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BellRing, ExternalLink, FolderPen, FolderX } from "lucide-react";
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

import { refreshDashboardAfterDeletion } from "../_actions/refresh-dashboard-after-deletion";

const formNameSchema = z.object({
  name: z.string().min(1).optional(),
});

const formReturnUrlSchema = z.object({
  returnUrl: z.string().url().optional(),
});

const enableFormSubmissionsSchema = z.object({
  enableFormSubmissions: z.boolean().default(true).optional(),
});

const enableRetentionSchema = z.object({
  enableRetention: z.boolean().default(true).optional(),
});

const enableNotificationsSchema = z.object({
  enableNotifications: z.boolean().default(true).optional(),
});

type FormNameSchema = z.infer<typeof formNameSchema>;
type EnableFormSubmissionsSchema = z.infer<typeof enableFormSubmissionsSchema>;
type EnableSubmissionsRetentionSchema = z.infer<typeof enableRetentionSchema>;
type EnableFormNotificationsSchema = z.infer<typeof enableNotificationsSchema>;
type FormReturnUrlSchema = z.infer<typeof formReturnUrlSchema>;

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
      async onSuccess() {
        utils.form.invalidate();

        // router.refresh();
        await refreshDashboardAfterDeletion();
        router.push("/dashboard");

        toast("Your form has been deleted", {
          icon: <FolderX className="h-4 w-4" />,
        });
      },
    });

  const handleDeleteForm = async () => {
    try {
      await deleteForm({ id: form.id });
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

      <ReturnUrlForm formId={form.id} returnUrl={form.returnUrl?.toString()} />

      <EnableFormSubmissions
        formId={form.id}
        enableSubmissions={form.enableSubmissions}
      />

      <EnableFormNotifications
        formId={form.id}
        enableNotifications={form.enableEmailNotifications}
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
                  <Input className="w-[250px]" {...field} min={1} />
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
const ReturnUrlForm = ({
  formId,
  returnUrl,
}: {
  formId: string;
  returnUrl: string | undefined;
}) => {
  const router = useRouter();

  const formReturnUrl = useForm<FormReturnUrlSchema>({
    resolver: zodResolver(formReturnUrlSchema),
    defaultValues: {
      returnUrl,
    },
  });

  const {
    mutateAsync: updateFormReturnURL,
    isLoading: isUpdatingFormReturnURL,
  } = api.form.update.useMutation();

  async function handleReturnURLSubmit(data: FormReturnUrlSchema) {
    try {
      await updateFormReturnURL({
        id: formId,
        returnUrl: data.returnUrl,
      });

      toast("Your form name has been updated", {
        icon: <ExternalLink className="h-4 w-4" />,
      });

      router.refresh();
    } catch {
      toast("Failed to update form name", {
        description: "Please try again later",
        icon: <ExternalLink className="h-4 w-4" />,
      });
    }
  }

  return (
    <Form {...formReturnUrl}>
      <form onSubmit={formReturnUrl.handleSubmit(handleReturnURLSubmit)}>
        <FormField
          control={formReturnUrl.control}
          name="returnUrl"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Return URL</FormLabel>
                <FormDescription>
                  URL where users will be redirected after submitting the form
                </FormDescription>
              </div>
              <FormControl>
                <div className="flex gap-2">
                  <Input
                    className="w-[250px]"
                    {...field}
                    placeholder="Enter return url here"
                    type="url"
                  />
                  <Button
                    loading={isUpdatingFormReturnURL}
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
const EnableFormNotifications = ({
  formId,
  enableNotifications,
}: {
  formId: string;
  enableNotifications: boolean;
}) => {
  const router = useRouter();

  const enableNotificationsForm = useForm<EnableFormNotificationsSchema>({
    resolver: zodResolver(enableNotificationsSchema),
    defaultValues: {
      enableNotifications: enableNotifications,
    },
  });

  const { mutateAsync: updateForm, isLoading: isUpdatingForm } =
    api.form.update.useMutation();

  async function handleEnableSubmissionsNotifications(
    data: EnableFormNotificationsSchema,
  ) {
    try {
      await updateForm({
        id: formId,
        enableNotifications: data.enableNotifications,
      });

      toast(
        data.enableNotifications
          ? "You will now receive email notifications for new submissions"
          : "You will no longer receive email notifications for new submissions",
        {
          icon: <BellRing className="h-4 w-4" />,
        },
      );

      router.refresh();
    } catch {
      toast("Failed to update form", {
        description: "Please try again later",
        icon: <BellRing className="h-4 w-4" />,
      });
    }
  }

  return (
    <Form {...enableNotificationsForm}>
      <FormField
        control={enableNotificationsForm.control}
        name="enableNotifications"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Enable Form Submission Notifications
              </FormLabel>
              <FormDescription>
                Turn off this option to prevent your form from sending you email
                notifications for new submissions
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(isChecked) => {
                  field.onChange(isChecked);
                  handleEnableSubmissionsNotifications({
                    enableNotifications: isChecked,
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
