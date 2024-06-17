import { userAgent } from 'next/server';

import { type Form } from '@formbase/db/schema';
import { env } from '@formbase/env';

import { sendMail } from '~/lib/email/mailer';
import { renderNewSubmissionEmail } from '~/lib/email/templates/new-submission';
import { api } from '~/lib/trpc/server';
import { assignFileOrImage, uploadFileFromBlob } from '~/lib/upload-file';

type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function getFormData(request: Request): Promise<{
  data: Record<string, Blob | string | undefined>;
  source: 'formData' | 'json';
}> {
  try {
    const formData = await request.formData();
    const data: Record<string, Blob | string | undefined> = {};
    formData.forEach((value, key) => {
      data[key] = value as Blob | string;
    });
    return { data, source: 'formData' };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('FormData')) {
      const jsonData = (await request.json()) as Record<string, unknown>;
      if (typeof jsonData !== 'object') {
        throw new Error('Invalid form data');
      }
      const data: Record<string, Blob | string | undefined> = {};
      Object.keys(jsonData).forEach((key) => {
        data[key] = jsonData[key] as Blob | string | undefined;
      });
      return { data, source: 'json' };
    } else {
      throw new Error('Invalid form data');
    }
  }
}

async function processFileUploads(
  formData: Record<string, Blob | string | undefined>,
  formDataFromRequest: FormData,
) {
  const fileKeys = Object.keys(formData).filter(
    (key) => formData[key] instanceof Blob,
  );

  for (const key of fileKeys) {
    const file = formDataFromRequest.get(key) as File;
    const fileUrl = await uploadFileFromBlob({ file });
    assignFileOrImage({ formData, key, fileUrl });
  }
}

async function handleEmailNotifications(form: Form, formId: string) {
  if (form.enableEmailNotifications) {
    const user = await api.user.getUserById({ userId: form.userId });
    if (!user) throw new Error('User not found');

    await sendMail({
      to: user.email,
      subject: `New Submission for "${form.title}"`,
      body: renderNewSubmissionEmail({
        link: `http://localhost:3000/form/${formId}`,
        formTitle: form.title,
      }),
    });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    if (!params.id) {
      return new Response('Form ID is required', { status: 400 });
    }

    const formId = params.id;
    const form = await api.form.getFormById({ formId });
    if (!form) {
      return new Response('Form not found', {
        status: 404,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    const { data: formData, source } = await getFormData(request);

    if (source === 'formData')
      await processFileUploads(formData, formData as unknown as FormData);

    const formDataKeys = Object.keys(formData);
    const formKeys = form.keys;
    const updatedKeys = [...new Set([...formKeys, ...formDataKeys])];

    await api.formData.setFormData({
      data: formData as Json,
      formId,
      keys: updatedKeys,
    });

    void handleEmailNotifications(form, formId);

    const { browser } = userAgent(request);

    if (!browser.name) {
      return new Response(
        JSON.stringify({
          formId,
          message: 'Submission successful',
          data: formData,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        },
      );
    }

    return new Response(null, {
      status: 303,
      headers: {
        Location: `${env.NEXT_PUBLIC_APP_URL}/s/${formId}`,
        ...CORS_HEADERS,
      },
    });
  } catch (error) {
    console.error(error);
    return new Response('There was an issue processing your form', {
      status: 500,
      headers: {
        ...CORS_HEADERS,
      },
    });
  }
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function OPTIONS() {
  return new Response('', {
    status: 200,
    headers: CORS_HEADERS,
  });
}
