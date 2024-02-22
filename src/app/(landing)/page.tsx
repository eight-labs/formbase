import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { type Metadata } from "next";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Drizzle,
  LuciaAuth,
  NextjsDark,
  NextjsLight,
  ReactEmail,
  ReactJs,
  ShadcnUi,
  StripeLogo,
  TRPC,
  TailwindCss,
} from "./_components/feature-icons";

export const metadata: Metadata = {
  title: "Next.js Lucia Auth Starter Template",
  description:
    "A Next.js starter template with nextjs and Lucia auth. Includes drizzle, trpc, react-email, tailwindcss and shadcn-ui",
};

const githubUrl = "https://github.com/eight-labs/formbase";

const features = [
  {
    name: "Next.js",
    description: "The React Framework for Production",
    logo: NextjsIcon,
  },
  {
    name: "React.js",
    description: "Server and client components.",
    logo: ReactJs,
  },
  {
    name: "Authentication",
    description:
      "Credential authentication with password reset and email validation",
    logo: LuciaAuth,
  },
  {
    name: "Database",
    description: "Drizzle with planetscale mysql database",
    logo: Drizzle,
  },
  {
    name: "TypeSafe Backend",
    description: "Preserve type safety from backend to frontend with tRPC",
    logo: TRPC,
  },
  {
    name: "Subscription",
    description: "Subscription with stripe",
    logo: StripeLogo,
  },
  {
    name: "Tailwindcss",
    description: "Simple and elegant UI components built with Tailwind CSS",
    logo: TailwindCss,
  },
  {
    name: "Shadcn UI",
    description: "A set of beautifully designed UI components for React",
    logo: ShadcnUi,
  },
  {
    name: "React Email",
    description: "Write emails in React with ease.",
    logo: ReactEmail,
  },
];

const HomePage = () => {
  return (
    <>
      <section className="mx-auto grid min-h-[calc(100vh-75px)] items-center">
        <div className="p-4">
          <h1 className="text-balance text-center text-3xl font-bold md:text-4xl lg:text-5xl">
            Formbase
          </h1>
          <p className="mb-8 mt-4 text-balance text-center text-muted-foreground md:text-lg lg:text-xl">
            Simplify the process of collecting and managing form submissions
          </p>

          <div className="flex justify-center gap-4">
            <Button size="lg" variant="outline" asChild>
              <a href={githubUrl}>
                <GitHubLogoIcon className="mr-1 h-5 w-5" />
                GitHub
              </a>
            </Button>
            <Button size="lg" asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="min-h-[calc(100vh-75px)]">
        <div className="container mx-auto lg:max-w-screen-lg">
          <h1 className="mb-4 text-center text-3xl font-bold md:text-4xl lg:text-5xl">
            <a id="features"></a> Features
          </h1>
          <p className="mb-10 text-balance text-center text-muted-foreground md:text-lg lg:text-xl">
            This starter template is a guide to help you get started with
            Next.js for large scale applications. Feel free to add or remove
            features to suit your needs.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.name}>
                <div className="pl-6 pt-6">
                  <feature.logo className="h-12 w-12" />
                </div>
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl">{feature.name}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;

function NextjsIcon({ className }: { className?: string }) {
  return (
    <>
      <NextjsLight className={className + " dark:hidden"} />
      <NextjsDark className={className + " hidden dark:block"} />
    </>
  );
}
