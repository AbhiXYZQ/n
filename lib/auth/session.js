import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'nainix_session';
const DEFAULT_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('Please define SESSION_SECRET environment variable.');
  }
  return secret;
}

function toBase64Url(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function fromBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(normalized + padding, 'base64').toString('utf8');
}

function signValue(value) {
  return toBase64Url(
    crypto.createHmac('sha256', getSessionSecret()).update(value).digest()
  );
}

export function createSessionToken(payload) {
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signValue(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signValue(encodedPayload);
  const signatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedSignatureBuffer.length) {
    return null;
  }

  const validSignature = crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer);
  if (!validSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload));
    if (!payload?.userId || !payload?.role || !payload?.exp) {
      return null;
    }

    if (Date.now() >= payload.exp) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

export function createSessionPayload({ userId, role, email }) {
  return {
    userId,
    role,
    email,
    iat: Date.now(),
    exp: Date.now() + DEFAULT_SESSION_MAX_AGE * 1000,
  };
}

export function setSessionCookie(response, payload) {
  const token = createSessionToken(payload);
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: DEFAULT_SESSION_MAX_AGE,
  });
}

export function clearSessionCookie(response) {
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

export function getSessionFromRequest(request) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export { SESSION_COOKIE_NAME };
