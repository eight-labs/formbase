import { CopyButton } from "~/components/copy-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/server";

import { SubmissionsTable } from "./submissions-table";
import SetupPage from "../_components/setup-tab";

export default async function FormPage({ params }: { params: { id: string } }) {
  const formId = params.id;
  const [form, _formSubmissions] = await Promise.all([
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
          <SubmissionsTable formId={formId} />
        </TabsContent>
        <TabsContent value="setup">
          <SetupPage formId={params.id} />
        </TabsContent>
        <TabsContent value="analytics">Look at your analytics here</TabsContent>
        <TabsContent value="settings">Edit your form here</TabsContent>
      </Tabs>
    </div>
  );
}
