export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { generateRandomToken } from '@/lib/auth';
import { sendVerificationEmail, formatEmailError } from '@/lib/email';

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // generate new verification token
    const token = generateRandomToken();
    user.emailVerificationToken = token;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    try {
      const result = await sendVerificationEmail(user.email, token, `${user.firstName} ${user.lastName}`);
      return NextResponse.json({
        success: true,
        provider: result?.provider || 'unknown',
        message: 'Verification email sent. Check your inbox and spam folder.',
      });
    } catch (emailErr) {
      console.error('Failed to resend verification email:', emailErr);
      const message = formatEmailError(emailErr);
      const status = message.includes('Test mode') ? 400 : 502;
      return NextResponse.json({ success: false, error: message }, { status });
    }
  } catch (err) {
    console.error('Resend verification error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
