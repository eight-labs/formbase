import type { TransportOptions } from 'nodemailer';

import { ResendTransport } from '@documenso/nodemailer-resend';
import { createTransport } from 'nodemailer';

import { env } from '@formbase/env';

const smtpConfig = {
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: true,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
};

const nodeMailerTransporter = createTransport(smtpConfig as TransportOptions);
const resendTransporter = createTransport(
  ResendTransport.makeTransport({
    apiKey: env.RESEND_API_KEY || '',
  }),
);

export type MessageInfo = {
  to: string;
  subject: string;
  body: string;
};

const transporter =
  env.SMTP_TRANSPORT === 'resend' ? resendTransporter : nodeMailerTransporter;

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
