export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import Wallet from '@/models/Wallet';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectToDatabase();
    
    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Get user with wallet
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const wallet = await Wallet.findOne({ userId: user._id });
    
    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      emailVerified: user.emailVerified,
      kycStatus: user.kycStatus,
      phone: user.phone,
      address: user.address,
      wallet: wallet ? {
        balances: wallet.balances,
        totalBalance: wallet.totalBalance,
      } : null,
      createdAt: user.createdAt,
    };
    
    return NextResponse.json({ user: userData });
    
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectToDatabase();
    
    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Get user
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    const { firstName, lastName, phone, address } = body;
    
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    
    if (address !== undefined) {
      user.address = {
        street: address.street !== undefined ? address.street : (user.address?.street || ''),
        city: address.city !== undefined ? address.city : (user.address?.city || ''),
        postcode: address.postcode !== undefined ? address.postcode : (user.address?.postcode || ''),
        country: address.country !== undefined ? address.country : (user.address?.country || ''),
      };
    }
    
    await user.save();
    
    const wallet = await Wallet.findOne({ userId: user._id });
    
    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      emailVerified: user.emailVerified,
      kycStatus: user.kycStatus,
      phone: user.phone,
      address: user.address,
      wallet: wallet ? {
        balances: wallet.balances,
        totalBalance: wallet.totalBalance,
      } : null,
      createdAt: user.createdAt,
    };
    
    return NextResponse.json({ user: userData });
    
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}