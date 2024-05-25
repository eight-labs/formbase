import type { TransportOptions } from 'nodemailer';

import { env } from '@formbase/env';
import { createTransport } from 'nodemailer';

const smtpConfig = {
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
};

const transporter = createTransport(smtpConfig as TransportOptions);

export type MessageInfo = {
  to: string;
  subject: string;
  body: string;
};

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
