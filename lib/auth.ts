import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

function signingKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error('AUTH_SECRET must be at least 32 characters');
  return new TextEncoder().encode(secret);
}

export async function setSession(u: { id: string; role: string }) {
  const token = await new SignJWT(u)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(signingKey());
  (await cookies()).set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 28800,
  });
}

export async function session() {
  try {
    const token = (await cookies()).get('session')?.value;
    if (!token) return null;
    return (await jwtVerify(token, signingKey())).payload as { id: string; role: string };
  } catch { return null; }
}

export async function requireRole(role: 'ADMIN' | 'CUSTOMER') {
  const s = await session();
  return s && s.role === role ? s : null;
}
