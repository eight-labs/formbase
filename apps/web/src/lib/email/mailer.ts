import type { TransportOptions } from 'nodemailer';

import { ResendTransport } from '@documenso/nodemailer-resend';
import { createTransport } from 'nodemailer';

import { env } from '@formbase/env';

const createSmtpTransport = () => {
  if (!env.SMTP_HOST || !env.SMTP_PORT) {
    throw new Error('Missing SMTP configuration for email delivery.');
  }
  if ((env.SMTP_USER && !env.SMTP_PASS) || (!env.SMTP_USER && env.SMTP_PASS)) {
    throw new Error('SMTP_USER and SMTP_PASS must be set together.');
  }

  const smtpConfig = {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.NODE_ENV === 'production',
    ...(env.SMTP_USER && env.SMTP_PASS
      ? {
          auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
          },
        }
      : {}),
  };

  return createTransport(smtpConfig as TransportOptions);
};
export type MessageInfo = {
  to: string;
  subject: string;
  body: string;
};

const transporter =
  env.SMTP_TRANSPORT === 'resend'
    ? (() => {
        if (!env.RESEND_API_KEY) {
          throw new Error('Missing RESEND_API_KEY for email delivery.');
        }

        return createTransport(
          ResendTransport.makeTransport({
            apiKey: env.RESEND_API_KEY,
          }),
        );
      })()
    : createSmtpTransport();

export const sendMail = async (message: MessageInfo) => {
  const { to, subject, body } = message;
  const mailOptions = {
    from: '"Formbase" <noreply@formbase.dev>',
    to,
    subject,
    html: body,
  };
  return transporter.sendMail(mailOptions);
};
