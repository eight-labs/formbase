import { CopyButton } from "~/components/copy-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/server";

import { ExportSubmissionsDropDownButton } from "./export-submissions-button";
import { SubmissionsTable } from "./submissions-table";

export default async function FormPage({ params }: { params: { id: string } }) {
  const formId = params.id;
  const [form, formSubmissions] = await Promise.all([
    api.form.get.query({ formId }),
    api.formData.all.query({ formId }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium">{form?.title}</h1>

        <div className="mt-2 flex items-center gap-2">
          <span className="inline-flex items-center rounded-lg bg-muted px-2 py-0.5 text-sm font-medium">
            {formId}
          </span>
          <CopyButton text={formId} />
        </div>
      </div>

      <Tabs defaultValue="submissions">
        <TabsList>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="submissions" className="my-6">
          {formSubmissions.length < 1 && form?.keys && form.keys.length < 2 ? (
            <div>No form submissions</div>
          ) : (
            <>
              <div className="flex w-full items-center justify-between">
                <span className="text-muted-foreground">
                  Total submissions: {formSubmissions.length}
                </span>
                <ExportSubmissionsDropDownButton
                  submissions={formSubmissions}
                  formKeys={form?.keys || ""}
                  formTitle={form?.title || ""}
                />
              </div>
              <SubmissionsTable
                formKeys={form?.keys || ""}
                formId={formId}
                submissions={formSubmissions}
              />
            </>
          )}
        </TabsContent>
        <TabsContent value="setup">Change your password here.</TabsContent>
        <TabsContent value="analytics">Look at your analytics here</TabsContent>
        <TabsContent value="settings">Edit your form here</TabsContent>
      </Tabs>
    </div>
  );
}
