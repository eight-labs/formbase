export const APP_TITLE = "Formbase";
export const DATABASE_PREFIX = "formbase";
export const EMAIL_SENDER = '"Formbase" <noreply@formbase.dev>';

export const redirects = {
  toLogin: "/login",
  toSignup: "/signup",
  afterLogin: "/dashboard",
  afterLogout: "/",
  toVerify: "/verify-email",
  afterVerify: "/dashboard",
} as const;
