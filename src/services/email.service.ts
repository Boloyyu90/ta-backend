import nodemailer from 'nodemailer';
import config from '../config/config';

const transport = nodemailer.createTransport({
  host: config.email.smtp.host,
  port: config.email.smtp.port,
  auth: {
    user: config.email.smtp.auth.user,
    pass: config.email.smtp.auth.pass
  }
});

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to: string, token: string): Promise<void> => {
  const subject = 'Reset password';
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to: string, token: string): Promise<void> => {
  const subject = 'Email Verification - Tryout System';
  const base = config.urls?.verifyEmail || 'http://localhost:3000/v1/auth/verify-email';
  const sep = base.includes('?') ? '&' : '?';
  const verificationEmailUrl = `${base}${sep}token=${encodeURIComponent(token)}`;

  const text = `Hello,

Please verify your email by clicking on the following link:

${verificationEmailUrl}

If you did not create an account, then ignore this email.`;

  await sendEmail(to, subject, text);
};

const sendTestEmail = async (to: string): Promise<void> => {
  const subject = 'Test Email - Tryout System';
  const text = `This is a test email from Tryout System!

If you received this email, your SMTP configuration is working correctly.

Timestamp: ${new Date().toISOString()}`;

  await sendEmail(to, subject, text);
};

export default {
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendTestEmail
};
