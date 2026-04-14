import { getSupabase } from '@/lib/db/supabase';
import { sendVerificationOTP } from '@/lib/email/resend';

/**
 * Generates a 6-digit numeric OTP and saves it to the database.
 * Then sends it to the user's email.
 */
export async function triggerEmailVerification(userId, userEmail, userName) {
  const supabase = getSupabase();
  
  // 1. Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

  // 2. Clear old codes for this user/type
  await supabase
    .from('verification_codes')
    .delete()
    .eq('user_id', userId)
    .eq('type', 'EMAIL');

  // 3. Save new code
  const { error: dbError } = await supabase.from('verification_codes').insert({
    user_id: userId,
    type: 'EMAIL',
    code,
    expires_at: expiresAt,
  });

  if (dbError) throw dbError;

  // 4. Send email
  try {
    const result = await sendVerificationOTP({ to: userEmail, name: userName, code });
    if (result.error) {
      console.error('[Resend Error]', result.error);
      throw new Error(`Resend Error: ${result.error.message}`);
    }
    console.log(`[Verification] OTP sent successfully to ${userEmail}`);
  } catch (emailError) {
    console.error('[Verification] Failed to send email:', emailError.message);
    throw emailError; // Rethrow to catch in the API route
  }

  return { success: true };
}
