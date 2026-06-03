export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
export const runtime = 'nodejs';

import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { dashboardRoutes } from '@/lib/routes';

function redirectTo(request, pathname, params = {}) {
  const url = new URL(pathname, request.url);
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '') url.searchParams.set(key, String(value));
  });
  return NextResponse.redirect(url);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const emailRaw = searchParams.get('email');

    if (!token || !emailRaw) {
      return redirectTo(request, '/verify-email', { error: 'invalid-token' });
    }

    const email = decodeURIComponent(emailRaw).toLowerCase().trim();

    await connectToDatabase();

    const alreadyVerified = await User.findOne({ email, emailVerified: true });
    if (alreadyVerified) {
      return redirectTo(request, dashboardRoutes.wallet, { verified: '1' });
    }

    const user = await User.findOne({
      email,
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return redirectTo(request, '/verify-email', {
        error: 'invalid-or-expired',
        email,
      });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return redirectTo(request, dashboardRoutes.wallet, { verified: '1' });
  } catch (err) {
    console.error('Server verify error:', err);
    return redirectTo(request, '/verify-email', { error: 'server' });
  }
}
