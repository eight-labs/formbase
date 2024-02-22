import { formDatas, forms } from "~/server/db/schema";
import { db } from "~/server/db";
import { generateId } from "lucia";
import { eq } from "drizzle-orm";

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

  await db.insert(formDatas).values({
    data: formData,
    formId,
    id: generateId(15),
    createdAt: new Date(),
  });

  await db
    .update(forms)
    .set({ updatedAt: new Date() })
    .where(eq(forms.id, formId));

  return Response.redirect(`http://localhost:3000/s/${formId}`, 303);
}
