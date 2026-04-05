import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/db/supabase';
import { createSessionPayload, setSessionCookie } from '@/lib/auth/session';
import { cookies } from 'next/headers';

function toSafeUser(user) {
  return {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    username: user.username,
    phone: user.phone,
    bio: user.bio,
    country: user.country,
    state: user.state,
    city: user.city,
    avatarUrl: user.avatar_url || user.avatarUrl,
    videoIntro: user.video_intro || user.videoIntro,
    portfolioUrl: user.portfolio_url || user.portfolioUrl,
    skills: user.skills || [],
    portfolio: user.portfolio || [],
    socialLinks: user.social_links || user.socialLinks || {},
    roleProfile: user.role_profile || user.roleProfile || {},
    verifiedBadges: user.verified_badges || user.verifiedBadges || [],
    monetization: user.monetization || {},
    onboarding: user.onboarding || {},
    contactVerification: user.contact_verification || user.contactVerification || {},
    createdAt: user.created_at || user.createdAt,
    updatedAt: user.updated_at || user.updatedAt,
  };
}

export async function GET(request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') || '/';
    
    // We construct the base URL safely
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? (process.env.NEXT_PUBLIC_BASE_URL || requestUrl.origin)
      : requestUrl.origin;

    if (!code) {
      return NextResponse.redirect(`${baseUrl}/login?error=MissingAuthCode`);
    }

    const supabase = getSupabase();
    
    // Exchange the code for a session
    const { data: authData, error: authError } = await supabase.auth.exchangeCodeForSession(code);

    if (authError || !authData.session) {
      console.error('[OAuth Callback] Session exchange failed:', authError);
      return NextResponse.redirect(`${baseUrl}/login?error=OAuthFailed`);
    }

    const authUser = authData.session.user;
    const email = authUser.email;

    if (!email) {
      return NextResponse.redirect(`${baseUrl}/login?error=EmailNotProvidedByOAuth`);
    }

    // Check if this user exists in our local custom 'users' table
    const { data: existingUser, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (dbError) {
      console.error('[OAuth Callback] DB lookup failed:', dbError);
      return NextResponse.redirect(`${baseUrl}/login?error=InternalDatabaseError`);
    }

    if (existingUser) {
      // User already exists, log them in normally via our custom JWT session
      const safeUser = toSafeUser(existingUser);
      // We will redirect directly. To set a cookie during redirect using next/server:
      const response = NextResponse.redirect(
        `${baseUrl}${existingUser.role === 'CLIENT' ? '/dashboard/client' : '/dashboard/freelancer'}`
      );
      setSessionCookie(response, createSessionPayload({ userId: safeUser.id, role: safeUser.role, email: safeUser.email }));
      
      return response;
    } else {
      // User does NOT exist in custom 'users' table. Need to register.
      // We store the OAuth metadata to bypass the password in `/register`
      const metadata = authUser.user_metadata || {};
      const oauthPendingPayload = JSON.stringify({
        email: email,
        name: metadata.full_name || metadata.name || '',
        avatar_url: metadata.avatar_url || metadata.picture || '',
        providerId: authUser.id, // The raw Supabase auth ID
        verified: true,
      });
      
      const redirectUrl = new URL(`${baseUrl}/register`);
      redirectUrl.searchParams.set('oauth', 'true');
      if (metadata.full_name || metadata.name) redirectUrl.searchParams.set('name', metadata.full_name || metadata.name);
      if (email) redirectUrl.searchParams.set('email', email);

      const response = NextResponse.redirect(redirectUrl.toString());
      // Short-lived cookie to verify they came from OAuth (1 hour)
      const base64Payload = Buffer.from(oauthPendingPayload).toString('base64');
      response.cookies.set('oauth_pending', base64Payload, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60,
      });

      return response;
    }

  } catch (error) {
    console.error('[OAuth Callback Route]', error);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/login?error=InternalServerError`);
  }
}
