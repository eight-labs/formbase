import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@formbase/ui/primitives/tabs';
import { cn } from '@formbase/ui/utils/cn';

import { highlightCode } from '~/lib/highlight-code';

import SendFormSubmissionButton from './send-submission-button';

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
    <div
      className={cn('-mt-0.5', {
        'pointer-events-none opacity-50 select-none': formId === null,
      })}
    >
      <h2 className="text-xl font-semibold">Send a submission</h2>
      <div className="text-gray-600 dark:text-muted-foreground mt-2">
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

          <SendFormSubmissionButton formId={formId} />
        </div>
      </div>
    </div>
  );
};
