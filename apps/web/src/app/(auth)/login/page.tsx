import { redirect } from "next/navigation";

import { validateRequest } from "src/lib/auth/validate-request";
import { redirects } from "@formbase/lib/constants";

import { Login } from "./login";

export const metadata = {
  title: "Login",
  description: "Login Page",
};

export default async function LoginPage() {
  const { user } = await validateRequest();

  if (user) redirect(redirects.afterLogin);

  return <Login />;
}
