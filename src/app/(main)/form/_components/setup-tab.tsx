import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { codeToHtml } from "shiki";

import { CopyButton } from "~/components/copy-button";
import { SubmitButton } from "~/components/submit-button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";

// we will use regular expressions to replace the replaceMe string with the actual URL
const htmlCodeToDisplay = `<form action="replaceMe">
  <div>
    <label>Name</label>
    <input type="text" />
  </div>
  <div>
    <label>Email</label>
    <input type="email" />
  </div>
  <div>
    <label>Message</label>
    <textarea rows="5"></textarea>
  </div>
  <button type="submit">Submit</button>
</form>`;

const frameworksToDisplay = [
  {
    name: "Nextjs",
    link: "https://formbase.dev/docs/Nextjs",
    svg: "/images/Next.svg",
  },
  {
    name: "Angular",
    link: "https://formbase.dev/docs/nextjs",
    svg: "/images/Angular.svg",
  },
  {
    name: "HTML",
    link: "https://formbase.dev/docs/html",
    svg: "/images/HTML.svg",
  },
  {
    name: "jquery",
    link: "https://formbase.dev/docs/jquery",
    svg: "/images/JQuery.svg",
  },
];

const SetupPage = async ({ formId }: { formId: string }) => {
  const htmlCodeToRenderInForm = await codeToHtml(
    htmlCodeToDisplay.replace(
      "replaceMe",
      "http://localhost:3000/s/9cf6qr2slij789c",
    ),
    {
      lang: "html",
      theme: "vitesse-dark",
    },
  );

  return (
    <div className="mt-8 px-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium">Your form endpoint</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            <span>
              Learn to set-up your form.{" "}
              <span className="text-black underline">
                Documentation
                <ArrowUpRight className="inline-block size-4" />
              </span>
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-md bg-slate-100 p-4 dark:bg-gray-800">
          <span className="font-mono text-xs">
            https://formbase.dev/s/{formId}
          </span>
          <CopyButton text="https://example.com/form" />
        </div>
      </div>
      {/* a section where we will show the various ways to set up your form and include links to the documentation site */}
      <div className="mt-10 flex flex-col items-center justify-center rounded-md p-4 dark:border dark:border-gray-500">
        <h2 className="text-lg font-medium">Setup your form</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Follow the steps below to setup your form.
        </p>

        <div className="mt-8 flex w-full justify-evenly  overflow-x-auto">
          {frameworksToDisplay.map((framework) => (
            <div className="flex items-center gap-2" key={framework.name}>
              <Image
                src={framework.svg}
                width={40}
                height={40}
                alt={`Image for logo ${framework.name}`}
              />
              <a href={framework.link} className="flex items-center gap-1">
                {framework.name}
                <ArrowUpRight className="size-4 text-slate-400" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* trial form to see how formbase works */}
      <div className="mt-10 flex flex-col items-center justify-center">
        <h2 className="text-lg font-medium">Test the Form</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Test the form below to see how submissions work
        </p>

        <Tabs defaultValue="form" className="mb-8 mt-3 md:w-[500px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Form</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="form" className="mt-6">
            <form
              className="flex flex-col gap-4"
              action={`http://localhost:3000/s/${formId}`}
            >
              <div>
                <Label>Name</Label>
                <Input type="text" placeholder="Your name" required={true} />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="name@email.com"
                  required={true}
                />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea
                  className="block w-full rounded-md border-gray-300"
                  rows={5}
                  placeholder="Your message here"
                ></Textarea>
              </div>
              <SubmitButton>Submit</SubmitButton>
            </form>
          </TabsContent>
          <TabsContent value="code" className="mt-6">
            <div
              className="overflow-x-scroll rounded-md"
              dangerouslySetInnerHTML={{
                __html: htmlCodeToRenderInForm,
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SetupPage;
