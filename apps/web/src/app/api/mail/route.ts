import { match } from "ts-pattern";

import { sendResetPasswordEmail, sendVerificationEmail } from "~/lib/email";

type SendMailPayload =
  | {
      email: string;
      code: string;
      type: "verification";
    }
  | {
      email: string;
      link: string;
      type: "reset";
    };

export async function POST(request: Request) {
  const body = (await request.json()) as SendMailPayload;

  if (!body.email) {
    return new Response("Missing email", { status: 400 });
  }

  try {
    await match(body)
      .with({ type: "reset" }, async ({ email, link }) => {
        await sendResetPasswordEmail({ email, link });
      })
      .with({ type: "verification" }, async ({ email, code }) => {
        await sendVerificationEmail({ email, code });
      })
      .exhaustive();

    return new Response("Mail sent", { status: 200 });
  } catch (error) {
    return new Response("There was an error sending the email", {
      status: 500,
    });
  }
}
