import { ResendTransport } from '@documenso/nodemailer-resend';
import { createTransport } from 'nodemailer';

import { env } from '@formbase/env';

type MessageInfo = {
  to: string;
  subject: string;
  body: string;
};

const createSmtpTransport = () => {
  if (!env.SMTP_HOST || !env.SMTP_PORT || !env.SMTP_USER || !env.SMTP_PASS) {
    throw new Error('Missing SMTP configuration for auth emails.');
  }

  return createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.NODE_ENV === 'production',
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
};

const transporter =
  env.SMTP_TRANSPORT === 'resend'
    ? (() => {
        if (!env.RESEND_API_KEY) {
          throw new Error('Missing RESEND_API_KEY for auth emails.');
        }

        return createTransport(
          ResendTransport.makeTransport({
            apiKey: env.RESEND_API_KEY,
          }),
        );
      })()
    : createSmtpTransport();

const sendMail = async ({ to, subject, body }: MessageInfo) => {
  const mailOptions = {
    from: '"Formbase" <noreply@formbase.dev>',
    to,
    subject,
    html: body,
  };
  return transporter.sendMail(mailOptions);
};

export const sendVerificationEmail = async ({
  email,
  url,
}: {
  email: string;
  url: string;
}) =>
  sendMail({
    to: email,
    subject: 'Verify your email',
    body: `<p>Click the link to verify your email:</p><p><a href="${url}">Verify email</a></p>`,
  });

export const sendResetPasswordEmail = async ({
  email,
  url,
}: {
  email: string;
  url: string;
}) =>
  sendMail({
    to: email,
    subject: 'Reset your password',
    body: `<p>Click the link to reset your password:</p><p><a href="${url}">Reset password</a></p>`,
  });
