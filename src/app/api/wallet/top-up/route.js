export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Wallet from '@/models/Wallet';
import Card from '@/models/Card';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/auth';
import { config } from '@/config';

export async function POST(request) {
  try {
    await connectToDatabase();

    const token = request.cookies.get('auth-token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { amount, currency, cardId, description } = body;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (parsedAmount < config.minTopUp) {
      return NextResponse.json({ error: `Minimum top-up is ${config.minTopUp}` }, { status: 400 });
    }

    const wallet = await Wallet.findOne({ userId: decoded.userId });
    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    const hasVirtualCard = await Card.exists({ userId: decoded.userId });
    if (!hasVirtualCard) {
      return NextResponse.json(
        {
          error:
            'Add an Aura card first. Open My Cards and use Get a Card before topping up your wallet.',
        },
        { status: 400 }
      );
    }

    // Simulate payment processing here (integrate payment gateway in production)
    // For now, we mark transaction as completed immediately.
    const txn = await Transaction.create({
      userId: decoded.userId,
      type: 'deposit',
      status: 'completed',
      amount: parsedAmount,
      currency: currency || 'EUR',
      fee: 0,
      description: description || 'Top-up',
      metadata: { cardId: cardId || null },
      completedAt: new Date(),
    });

    // Update wallet balance
    await wallet.addBalance(txn.currency, parsedAmount);

    return NextResponse.json({ success: true, transaction: txn, wallet }, { status: 200 });
  } catch (err) {
    console.error('Top-up error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
