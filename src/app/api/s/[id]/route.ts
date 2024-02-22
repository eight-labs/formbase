import { sendMail } from "@/server/send-mail";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { db } from "~/server/db";
import { formDatas, forms } from "~/server/db/schema";

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

  if (!form) {
    return new Response("Form not found", { status: 404 });
  }

  await db.insert(formDatas).values({
    data: formData,
    formId,
    id: generateId(15),
    createdAt: new Date(),
  });

  const formInformation = await db
    .update(forms)
    .set({ updatedAt: new Date() })
    .where(eq(forms.id, formId))
    .returning();

  // only send the email if the user has enabled it: it is enabled by default
  if (formInformation[0]!.sendEmailForNewSubmissions) {
    const userId = formInformation[0]!.userId;

    const user = await db.query.users.findFirst({
      where: (table, { eq }) => eq(table.id, userId),
    });

    sendMail({
      to: user!.email,
      subject: `New submission for ${formInformation[0]!.title}`,
      body: `You have a new submission for your form ${formInformation[0]!.title}`,
    });
  }

  return Response.redirect(`http://localhost:3000/s/${formId}`, 303);
}
