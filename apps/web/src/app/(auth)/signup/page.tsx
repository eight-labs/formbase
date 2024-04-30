import { validateRequest } from "@formbase/lib/auth/validate-request";
import { redirects } from "@formbase/lib/constants";
import { redirect } from "next/navigation";

import { Signup } from "./signup";

export const metadata = {
  title: "Sign Up",
  description: "Signup Page",
};

export default async function SignupPage() {
  const { user } = await validateRequest();

  if (user) redirect(redirects.afterLogin);

  return <Signup />;
}
