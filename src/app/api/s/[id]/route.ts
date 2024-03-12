import { eq } from "drizzle-orm";
import { userAgent } from "next/server";

import { renderNewSubmissionEmail } from "~/lib/email-templates/new-submission";
import { generateId } from "~/lib/utils/generate-id";
import { db } from "~/server/db";
import { formDatas, forms } from "~/server/db/schema";
import { sendMail } from "~/server/send-mail";
import {
  assignFileOrImage,
  uploadFile,
  uploadFileFromBlob,
} from "~/server/upload-file";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  if (!params.id) {
    return new Response("Form ID is required", { status: 400 });
  }

  const formId = params.id;
  const form = await db.query.forms.findFirst({
    where: (table, { eq }) => eq(table.id, formId),
  });

  let formDataFromRequest;
  let source;

  try {
    formDataFromRequest = await request.formData();
    source = "formData";
  } catch (error) {
    const errorJSON = error as unknown as Error;

    if (
      errorJSON.name === "TypeError" &&
      errorJSON.message.includes("FormData")
    ) {
      formDataFromRequest = await request.json();
      source = "json";

      if (!formDataFromRequest) {
        return new Response("Invalid form data", { status: 400 });
      }
    }
  }
  try {
    const formData =
      source === "formData"
        ? Object.fromEntries(formDataFromRequest)
        : formDataFromRequest;

    const { browser } = userAgent(request);

    const fileKeys = Object.keys(formData).filter(
      (key) => formData[key] instanceof Blob,
    );

    for (const key of fileKeys) {
      const fileUrl = await uploadFileFromBlob(formData[key]);
      assignFileOrImage(formData, key, fileUrl);
    }

    const formDataKeys = Object.keys(formData);
    const formKeys = form?.keys || [];
    const updatedKeys = [...new Set([...formKeys, ...formDataKeys])];

    if (!form) {
      return new Response("Form not found", { status: 404 });
    }

    await db.transaction(async (tx) => {
      await tx.insert(formDatas).values({
        data: formData,
        formId,
        id: generateId(15),
        createdAt: new Date(),
      });

      await tx
        .update(forms)
        .set({
          updatedAt: new Date(),
          keys: updatedKeys,
        })
        .where(eq(forms.id, formId));
    });

    if (form.enableEmailNotifications) {
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

    if (!browser.name) {
      return Response.json({
        formId,
        message: "Submission successful",
        data: formData,
      });
    }

    return Response.redirect(`http://localhost:3000/s/${formId}`, 303);
  } catch (error) {
    console.error(error);
    return new Response("There was an issue processing your form", {
      status: 500,
    });
  }
}
