import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectToDatabase from './db';
import User from '@/models/User';

const AUTH_COOKIE_NAME = 'med_auth_token';

export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('AUTH_SECRET environment variable is missing in production');
    }
    return 'fallback_dev_auth_secret_32_characters_minimum';
  }
  return secret;
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password, hash) {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
}

export function signToken(payload) {
  const secret = getAuthSecret();
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    const secret = getAuthSecret();
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

/**
 * Extracts auth user from HTTP-only cookie in Next.js Server Components or Route Handlers.
 */
export async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) return null;

    await connectToDatabase();
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user || user.status !== 'ACTIVE') {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

/**
 * Helper to set secure HTTP-only authentication cookie on Next.js NextResponse.
 */
export function setAuthCookie(response, token) {
  const isProduction = process.env.NODE_ENV === 'production';
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
  return response;
}

/**
 * Helper to clear authentication cookie.
 */
export function clearAuthCookie(response) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}

/**
 * Validates whether creatorRole is allowed to create targetRole.
 */
export function validateCreationPermission(creatorRole, targetRole) {
  if (creatorRole === 'ADMIN' && targetRole === 'COORDINATOR') return true;
  if (creatorRole === 'COORDINATOR' && targetRole === 'SUPERVISOR') return true;
  if (creatorRole === 'SUPERVISOR' && targetRole === 'DIGITAL_OPD_AGENT') return true;
  return false;
}

/**
 * Validates allowed medicine supply relationships.
 */
export function validateSupplyPermission(senderRole, receiverRole) {
  if (senderRole === 'ADMIN' && receiverRole === 'COORDINATOR') return true;
  if (senderRole === 'COORDINATOR' && receiverRole === 'SUPERVISOR') return true;
  if (senderRole === 'SUPERVISOR' && receiverRole === 'DIGITAL_OPD_AGENT') return true;
  return false;
}
