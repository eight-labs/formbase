import { api } from "~/trpc/server";
import { Copy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
          <Copy className="h-4 w-4 text-muted-foreground" />
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
          <SubmissionsTable submissions={formSubmissions} />
        </TabsContent>
        <TabsContent value="setup">Change your password here.</TabsContent>
        <TabsContent value="analytics">Look at your analytics here</TabsContent>
        <TabsContent value="settings">Edit your form here</TabsContent>
      </Tabs>
    </div>
  );
}
