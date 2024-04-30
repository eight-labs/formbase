import { validateRequest } from "@formbase/lib/auth/validate-request";
import { redirects } from "@formbase/lib/constants";
import { redirect } from "next/navigation";

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
