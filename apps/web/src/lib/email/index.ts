import { sendMail } from './mailer';
import { renderVerificationCodeEmail } from './templates/email-verification';
import { renderResetPasswordEmail } from './templates/reset-password';

export const sendVerificationEmail = async ({
  email,
  code,
}: {
  email: string;
  code: string;
}) => {
  await sendMail({
    to: email,
    subject: 'Verify your account',
    body: renderVerificationCodeEmail({ code }),
  });
};

export const sendResetPasswordEmail = async ({
  email,
  link,
}: {
  email: string;
  link: string;
}) => {
  await sendMail({
    to: email,
    subject: 'Reset your password',
    body: renderResetPasswordEmail({ link }),
  });
};
