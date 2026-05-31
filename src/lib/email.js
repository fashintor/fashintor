import nodemailer from 'nodemailer';

function createSmtpTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: String(process.env.SMTP_SECURE) === 'true' || process.env.SMTP_PORT === '465',
    auth: process.env.SMTP_USER ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    } : undefined,
  });
}

async function trySend({ from, to, subject, html }) {
  const transport = createSmtpTransport();
  try {
    const info = await transport.sendMail({ from, to, subject, html });
    return { info };
  } catch (err) {
    // If running locally and SMTP failed, fall back to Ethereal test account
    if (process.env.NODE_ENV !== 'production') {
      try {
        const testAccount = await nodemailer.createTestAccount();
        const ethTransport = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });

        const info = await ethTransport.sendMail({ from, to, subject, html });
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.warn('SMTP send failed, used Ethereal fallback. Preview URL:', previewUrl);
        return { info, previewUrl };
      } catch (ethErr) {
        console.error('Ethereal fallback also failed:', ethErr);
        throw err; // rethrow original SMTP error
      }
    }

    throw err;
  }
}

// generic HTML templates
function verificationHtml(verificationUrl, name) {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'AURA FINANCE';
  const logoText = (process.env.NEXT_PUBLIC_COMPANY_NAME || 'AURA').split(' ')[0];
  return `<!DOCTYPE html><html><head><style>body{font-family:Manrope,sans-serif;background:#fbf9f9;padding:40px}.container{max-width:600px;margin:0 auto;background:#fff;border-radius:12px;padding:48px}.logo{font-family:Noto Serif,serif;font-size:24px;margin-bottom:32px}.button{background:#000;color:#fff;padding:16px 32px;border-radius:4px;text-decoration:none;display:inline-block;margin:24px 0}.footer{margin-top:48px;font-size:12px;color:#666}</style></head><body><div class="container"><div class="logo">${logoText}</div><h2>Welcome, ${name}!</h2><p>Please verify your email address to complete your registration.</p><a href="${verificationUrl}" class="button">Verify Email</a><p>Or copy this link: ${verificationUrl}</p><div class="footer"><p>This link expires in 24 hours.</p><p>© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p></div></div></body></html>`;
}

function resetHtml(resetUrl) {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'AURA FINANCE';
  const logoText = (process.env.NEXT_PUBLIC_COMPANY_NAME || 'AURA').split(' ')[0];
  return `<!DOCTYPE html><html><head><style>body{font-family:Manrope,sans-serif;background:#fbf9f9;padding:40px}.container{max-width:600px;margin:0 auto;background:#fff;border-radius:12px;padding:48px}.logo{font-family:Noto Serif,serif;font-size:24px;margin-bottom:32px}.button{background:#000;color:#fff;padding:16px 32px;border-radius:4px;text-decoration:none;display:inline-block;margin:24px 0}.footer{margin-top:48px;font-size:12px;color:#666}</style></head><body><div class="container"><div class="logo">${logoText}</div><h2>Reset Your Password</h2><p>Click the button below to reset your password.</p><a href="${resetUrl}" class="button">Reset Password</a><p>If you didn't request this, please ignore this email.</p><div class="footer"><p>This link expires in 1 hour.</p><p>© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p></div></div></body></html>`;
}

export async function sendVerificationEmail(email, token, name) {
  // point to the server-side verification endpoint so the user is marked verified
  // before redirecting back to the UI
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
  const html = verificationHtml(verificationUrl, name);

  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'AURA Finance';
  const result = await trySend({ from: process.env.EMAIL_FROM, to: email, subject: `Verify Your Email - ${companyName}`, html });
  return result;
}

export async function sendPasswordResetEmail(email, token) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/reset-password?token=${token}`;
  const html = resetHtml(resetUrl);

  const companyName2 = process.env.NEXT_PUBLIC_COMPANY_NAME || 'AURA Finance';
  const result = await trySend({ from: process.env.EMAIL_FROM, to: email, subject: `Reset Your Password - ${companyName2}`, html });
  return result;
}