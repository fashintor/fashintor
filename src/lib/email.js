import { Resend } from 'resend';
import nodemailer from 'nodemailer';

/** Human-readable message from Resend API errors */
export function formatEmailError(err) {
  if (!err) return 'Failed to send email';

  let raw = err.message || String(err);
  raw = raw.replace(/^Resend failed:\s*/i, '');

  try {
    const jsonStart = raw.indexOf('{');
    if (jsonStart !== -1) {
      const parsed = JSON.parse(raw.slice(jsonStart));
      if (parsed.message) return parsed.message;
    }
  } catch {
    /* use raw */
  }

  if (raw.includes('only send testing emails')) {
    const allowed = process.env.RESEND_TEST_RECIPIENT_EMAIL || 'your Resend account email';
    return `Test mode: emails can only be sent to ${allowed}. Register with that address, or verify your domain at https://resend.com/domains and set EMAIL_FROM to an address on that domain.`;
  }

  return raw || 'Failed to send email';
}

function assertResendRecipientAllowed(to) {
  const from = getEmailFrom();
  if (!from.includes('@resend.dev')) return;

  const allowed =
    process.env.RESEND_TEST_RECIPIENT_EMAIL?.toLowerCase().trim() ||
    process.env.RESEND_ACCOUNT_EMAIL?.toLowerCase().trim();

  if (!allowed) return;

  if (to.toLowerCase().trim() !== allowed) {
    throw new Error(
      `Test mode: verification emails can only be sent to ${allowed}. Register with this email, or verify your domain at https://resend.com/domains and use EMAIL_FROM=Fashintor <info@fashintor.com>.`
    );
  }
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function getEmailFrom() {
  const configured = process.env.EMAIL_FROM?.trim();
  if (configured) return configured;
  if (process.env.RESEND_API_KEY) {
    return 'Fashintor <onboarding@resend.dev>';
  }
  return process.env.NODE_ENV === 'production'
    ? 'Fashintor <info@fashintor.com>'
    : 'Fashintor <onboarding@resend.dev>';
}

async function sendViaResend({ from, to, subject, html }) {
  assertResendRecipientAllowed(to);

  const resend = getResendClient();
  if (!resend) return null;

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    html,
  });

  if (error) {
    throw new Error(formatEmailError({ message: error.message || JSON.stringify(error) }));
  }

  return data;
}

function createSmtpTransport() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: String(process.env.SMTP_SECURE) === 'true' || process.env.SMTP_PORT === '465',
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });
}

async function trySend({ from, to, subject, html }) {
  if (process.env.RESEND_API_KEY?.trim()) {
    const info = await sendViaResend({ from, to, subject, html });
    return { info, provider: 'resend' };
  }

  const transport = createSmtpTransport();
  if (!transport) {
    throw new Error(
      'Email is not configured. Set RESEND_API_KEY in .env.local and restart the dev server.'
    );
  }

  const info = await transport.sendMail({ from, to, subject, html });
  return { info, provider: 'smtp' };
}

function verificationHtml(verificationUrl, name) {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'Fashintor';
  const logoText = companyName.split(' ')[0];
  return `<!DOCTYPE html><html><head><style>body{font-family:Manrope,sans-serif;background:#fbf9f9;padding:40px}.container{max-width:600px;margin:0 auto;background:#fff;border-radius:12px;padding:48px}.logo{font-family:Noto Serif,serif;font-size:24px;margin-bottom:32px}.button{background:#000;color:#fff;padding:16px 32px;border-radius:4px;text-decoration:none;display:inline-block;margin:24px 0}.footer{margin-top:48px;font-size:12px;color:#666}</style></head><body><div class="container"><div class="logo">${logoText}</div><h2>Welcome, ${name}!</h2><p>Please verify your email address to complete your registration.</p><a href="${verificationUrl}" class="button">Verify Email</a><div class="footer"><p>This link expires in 24 hours.</p><p>© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p></div></div></body></html>`;
}

function resetHtml(resetUrl) {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'Fashintor';
  const logoText = companyName.split(' ')[0];
  return `<!DOCTYPE html><html><head><style>body{font-family:Manrope,sans-serif;background:#fbf9f9;padding:40px}.container{max-width:600px;margin:0 auto;background:#fff;border-radius:12px;padding:48px}.logo{font-family:Noto Serif,serif;font-size:24px;margin-bottom:32px}.button{background:#000;color:#fff;padding:16px 32px;border-radius:4px;text-decoration:none;display:inline-block;margin:24px 0}.footer{margin-top:48px;font-size:12px;color:#666}</style></head><body><div class="container"><div class="logo">${logoText}</div><h2>Reset Your Password</h2><p>Click the button below to reset your password.</p><a href="${resetUrl}" class="button">Reset Password</a><p>If you didn't request this, please ignore this email.</p><div class="footer"><p>This link expires in 1 hour.</p><p>© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p></div></div></body></html>`;
}

export async function sendVerificationEmail(email, token, name) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
  const html = verificationHtml(verificationUrl, name);
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'Fashintor';
  const from = getEmailFrom();
  return trySend({ from, to: email, subject: `Verify Your Email - ${companyName}`, html });
}

export async function sendPasswordResetEmail(email, token) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/reset-password?token=${token}`;
  const html = resetHtml(resetUrl);
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'Fashintor';
  const from = getEmailFrom();
  return trySend({ from, to: email, subject: `Reset Your Password - ${companyName}`, html });
}

function topUpConfirmationHtml({ name, amount, currency, transactionId, newBalance }) {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'Fashintor';
  const logoText = companyName.split(' ')[0];
  const symbol = currency === 'USD' ? '$' : currency === 'GBP' ? '£' : '€';
  const date = new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
  return `<!DOCTYPE html><html><head><style>body{font-family:Manrope,sans-serif;background:#fbf9f9;padding:40px}.container{max-width:600px;margin:0 auto;background:#fff;border-radius:12px;padding:48px}.logo{font-family:Noto Serif,serif;font-size:24px;margin-bottom:32px}.badge{display:inline-block;background:#000;color:#fff;border-radius:50%;width:56px;height:56px;line-height:56px;text-align:center;font-size:28px;margin-bottom:24px}.amount{font-size:36px;font-weight:700;margin:8px 0}.table{width:100%;border-collapse:collapse;margin:24px 0}.table td{padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px}.table td:last-child{text-align:right;font-weight:600}.footer{margin-top:48px;font-size:12px;color:#666}</style></head><body><div class="container"><div class="logo">${logoText}</div><div class="badge">✓</div><h2>Your wallet has been topped up</h2><p>Hi ${name},</p><p>We have successfully added funds to your ${companyName} wallet.</p><div class="amount">${symbol}${parseFloat(amount).toFixed(2)}</div><table class="table"><tr><td>Transaction ID</td><td>${transactionId}</td></tr><tr><td>Date</td><td>${date}</td></tr><tr><td>Currency</td><td>${currency}</td></tr><tr><td>New Balance</td><td>${symbol}${parseFloat(newBalance).toFixed(2)}</td></tr></table><div class="footer"><p>If you did not make this transaction, please contact support immediately.</p><p>© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p></div></div></body></html>`;
}

export async function trySendTopUpConfirmation({ to, name, amount, currency, transactionId, newBalance }) {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'Fashintor';
  const from = getEmailFrom();
  const html = topUpConfirmationHtml({ name, amount, currency, transactionId, newBalance });
  return trySend({ from, to, subject: `Wallet Top-Up Confirmed — ${companyName}`, html });
}