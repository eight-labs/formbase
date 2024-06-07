import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@formbase/ui/primitives/tabs';

import { highlightCode } from '~/lib/highlight-code';

type CodeExampleStepProps = {
  formId: string | null;
};

export const CodeExampleStep = async ({ formId }: CodeExampleStepProps) => {
  const htmlCode = await highlightCode(`<form
    action="https://formbase.dev/s/${formId ?? 'abcdefghijkl'}" method="POST"
    enctype="multipart/form-data"
  >
    <input type="text" name="name" />
    <input type="email" name="email" />
    <textarea name="message"></textarea>

    <button type="submit">Submit</button>
</form>`);

  const reactcode =
    await highlightCode(`export default function FormbaseForm() {
    return (
      <form
        action="https://formbase.dev/s/${formId ?? 'abcdefghijkl'}"
        method="POST"
        encType="multipart/form-data"
      >
        <input type="text" name="name" />
        <input type="email" name="email" />
        <textarea name="message"></textarea>

        <button type="submit">Submit</button>
      </form>
    );
  }`);

  return (
    <div className="space-y-4">
      <p>Use the code below to recieve your first submission</p>

      <Tabs defaultValue="html">
        <TabsList>
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="react">React</TabsTrigger>
        </TabsList>
        <TabsContent value="html">
          <div
            className="mt-4 rounded-md"
            dangerouslySetInnerHTML={{
              __html: htmlCode,
            }}
          />
        </TabsContent>
        <TabsContent value="react">
          <div
            className="mt-4 rounded-md"
            dangerouslySetInnerHTML={{
              __html: reactcode,
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
