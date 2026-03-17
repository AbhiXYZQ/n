import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { getDatabase } from '@/lib/db/mongodb';
import { sendPasswordResetEmail } from '@/lib/email/resend';

const normalizeEmail = (email = '') => email.trim().toLowerCase();
const isDev = process.env.NODE_ENV !== 'production';
const hasResend = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_YOUR_API_KEY_HERE';

export async function POST(request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body?.email || '');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');
    const tokensCollection = db.collection('passwordResetTokens');

    const user = await usersCollection.findOne({ email });

    if (user) {
      // Delete any previous tokens for this user
      await tokensCollection.deleteMany({ userId: user.id });

      // Generate a secure token
      const token = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await tokensCollection.insertOne({
        userId: user.id,
        email: user.email,
        token,
        expiresAt,
        createdAt: new Date(),
      });

      // ── Send email if Resend is configured ──────────────
      if (hasResend) {
        try {
          await sendPasswordResetEmail({
            to: user.email,
            name: user.name,
            token,
          });
        } catch (emailError) {
          console.error('[Resend] Email send failed:', emailError?.message);
          // Don't block the response if email fails; token is already saved
        }
      }

      // ── Dev mode: return token in response for direct testing ──
      if (isDev) {
        const resetLink = `/reset-password?token=${token}`;
        return NextResponse.json({
          success: true,
          message: hasResend
            ? `Password reset email sent to ${email}. Check your inbox.`
            : 'Dev mode: use the resetLink below (no email service configured).',
          ...(isDev && { devToken: token, resetLink }),
        });
      }
    }

    // Always return the same response in production (security: don't reveal if email exists)
    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, you will receive reset instructions shortly.',
    });

  } catch (error) {
    console.error('[ForgotPassword]', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
