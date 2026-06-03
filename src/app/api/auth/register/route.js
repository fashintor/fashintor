import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import Wallet from '@/models/Wallet';
import { generateToken, generateRandomToken, formatUserResponse } from '@/lib/auth';
import { sendVerificationEmail, formatEmailError } from '@/lib/email';
import { config } from '@/config';

export async function POST(request) {
  try {
    console.log('📝 Registration attempt started...');
    
    await connectToDatabase();
    console.log('✅ Database connected');
    
    const body = await request.json();
    const { firstName, lastName, email, password, phone, dateOfBirth, address } = body;
    
    console.log(`📧 Checking email: ${email}`);
    
    // Validation
    if (!firstName || !lastName || !email || !password) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      console.log(`❌ User already exists with email: ${email}`);
      return NextResponse.json(
        { error: 'User already exists. Please login instead.' },
        { status: 409 }
      );
    }
    
    console.log('✅ Email is available, creating user...');
    
    // Generate email verification token
    const emailVerificationToken = generateRandomToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      phone,
      dateOfBirth,
      address,
      emailVerificationToken,
      emailVerificationExpires,
      emailVerified: config.testMode, // Auto-verify in test mode
    });
    
    console.log(`✅ User created with ID: ${user._id}`);
    
    // Create wallet for user
    await Wallet.create({
      userId: user._id,
      balances: { EUR: 0, USD: 0, GBP: 0 },
    });
    
    console.log('✅ Wallet created');
    
    // Send verification email (skip in test mode)
    if (!config.testMode) {
      try {
        await sendVerificationEmail(email, emailVerificationToken, `${firstName} ${lastName}`);
        console.log('📧 Verification email sent');
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        await User.findByIdAndDelete(user._id);
        await Wallet.deleteOne({ userId: user._id });
        return NextResponse.json(
          { error: formatEmailError(emailError) },
          { status: 400 }
        );
      }
    } else {
      console.log('🧪 TEST MODE: Skipping verification email');
    }
    
    // Generate JWT token
    const token = generateToken(user._id, user.email);
    
    // Set cookie
    const response = NextResponse.json({
      success: true,
      user: formatUserResponse(user),
      token,
      testMode: config.testMode,
    }, { status: 201 });
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });
    
    console.log('✅ Registration successful!');
    return response;
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}