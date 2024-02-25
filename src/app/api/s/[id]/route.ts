import { eq } from "drizzle-orm";
import { nanoid as generateId } from "nanoid";

import { renderNewSubmissionEmail } from "~/lib/email-templates/new-submission";
import { db } from "~/server/db";
import { formDatas, forms } from "~/server/db/schema";
import { sendMail } from "~/server/send-mail";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  if (!params.id) {
    return Response.redirect("/", 303);
  }

  const formId = params.id;
  const formDataFromRequest = await request.formData();
  const formData = Object.fromEntries(formDataFromRequest);

  const form = await db.query.forms.findFirst({
    where: (table, { eq }) => eq(table.id, formId),
  });

  const formDataKeys = Object.keys(formData);
  const formKeys = form?.keys?.split("~?") || [];
  const updatedKeys = [...new Set([...formKeys, ...formDataKeys])].join("~?");

  if (!form) {
    return new Response("Form not found", { status: 404 });
  }

  await db.insert(formDatas).values({
    data: formData,
    formId,
    id: generateId(15),
    createdAt: new Date(),
  });

  await db
    .update(forms)
    .set({
      updatedAt: new Date(),
      keys: updatedKeys,
    })
    .where(eq(forms.id, formId));

  // only send the email if the user has enabled it: it is enabled by default
  if (form.sendEmailForNewSubmissions) {
    const userId = form.userId;

    const user = await db.query.users.findFirst({
      where: (table, { eq }) => eq(table.id, userId),
    });

    sendMail({
      to: user!.email,
      subject: `New Submission for ${form.title}`,
      body: renderNewSubmissionEmail({
        link: `http://localhost:3000/form/${formId}`,
        formTitle: form.title,
      }),
    });
  }

  return Response.redirect(`http://localhost:3000/s/${formId}`, 303);
}
