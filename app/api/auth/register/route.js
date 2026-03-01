import { NextResponse } from 'next/server';
import { randomBytes, scryptSync } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '@/lib/db/mongodb';
import { createSessionPayload, setSessionCookie } from '@/lib/auth/session';

const normalizeEmail = (email = '') => email.trim().toLowerCase();
const normalizeUsername = (username = '') => username.trim().toLowerCase();

function isValidUrl(value = '') {
  if (!value) return true;
  try {
    new URL(value);
    return true;
  } catch (error) {
    return false;
  }
}

let indexesInitialized = false;

async function ensureIndexes(usersCollection) {
  if (indexesInitialized) {
    return;
  }

  await usersCollection.createIndex({ email: 1 }, { unique: true });
  await usersCollection.createIndex({ username: 1 }, { unique: true });
  indexesInitialized = true;
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

function toSafeUser(user) {
  const { passwordHash, passwordSalt, ...safeUser } = user;
  return safeUser;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = body?.name?.trim();
    const email = normalizeEmail(body?.email);
    const username = normalizeUsername(body?.username);
    const password = body?.password || '';
    const role = body?.role;
    const phone = body?.phone?.trim();
    const country = body?.country?.trim();
    const timezone = body?.timezone?.trim();
    const bio = body?.bio?.trim();
    const linkedin = body?.linkedin?.trim() || '';
    const github = body?.github?.trim() || '';
    const acceptTerms = !!body?.acceptTerms;
    const roleDetails = body?.roleDetails || {};

    if (!name || !email || !username || !password || !role || !phone || !country || !timezone || !bio) {
      return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, message: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    if (!['CLIENT', 'FREELANCER'].includes(role)) {
      return NextResponse.json({ success: false, message: 'Invalid role selected.' }, { status: 400 });
    }

    if (bio.length < 30) {
      return NextResponse.json({ success: false, message: 'Bio must be at least 30 characters.' }, { status: 400 });
    }

    if (!acceptTerms) {
      return NextResponse.json({ success: false, message: 'You must accept terms and privacy policy.' }, { status: 400 });
    }

    if (!isValidUrl(linkedin) || !isValidUrl(github)) {
      return NextResponse.json({ success: false, message: 'Please provide valid social profile URLs.' }, { status: 400 });
    }

    const freelancerRoleDetails = {
      professionalTitle: roleDetails?.professionalTitle?.trim() || '',
      experienceYears: Number(roleDetails?.experienceYears || 0),
      hourlyRate: Number(roleDetails?.hourlyRate || 0),
      skills: Array.isArray(roleDetails?.skills)
        ? roleDetails.skills.map((skill) => String(skill).trim()).filter(Boolean)
        : [],
      availability: roleDetails?.availability || '',
      portfolioUrl: roleDetails?.portfolioUrl?.trim() || '',
    };

    const clientRoleDetails = {
      companyName: roleDetails?.companyName?.trim() || '',
      companyWebsite: roleDetails?.companyWebsite?.trim() || '',
      companySize: roleDetails?.companySize || '',
      hiringGoal: roleDetails?.hiringGoal?.trim() || '',
      budgetRange: roleDetails?.budgetRange || '',
    };

    if (role === 'FREELANCER') {
      if (
        !freelancerRoleDetails.professionalTitle ||
        freelancerRoleDetails.experienceYears < 0 ||
        freelancerRoleDetails.hourlyRate <= 0 ||
        !freelancerRoleDetails.availability ||
        freelancerRoleDetails.skills.length < 3
      ) {
        return NextResponse.json({ success: false, message: 'Freelancer details are incomplete.' }, { status: 400 });
      }

      if (!linkedin && !github) {
        return NextResponse.json({ success: false, message: 'Add at least LinkedIn or GitHub URL.' }, { status: 400 });
      }

      if (!isValidUrl(freelancerRoleDetails.portfolioUrl)) {
        return NextResponse.json({ success: false, message: 'Invalid portfolio URL.' }, { status: 400 });
      }
    }

    if (role === 'CLIENT') {
      if (
        !clientRoleDetails.companyName ||
        !clientRoleDetails.companySize ||
        !clientRoleDetails.hiringGoal ||
        !clientRoleDetails.budgetRange
      ) {
        return NextResponse.json({ success: false, message: 'Client company details are incomplete.' }, { status: 400 });
      }

      if (!isValidUrl(clientRoleDetails.companyWebsite)) {
        return NextResponse.json({ success: false, message: 'Invalid company website URL.' }, { status: 400 });
      }
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');
    await ensureIndexes(usersCollection);

    const existingUser = await usersCollection.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ success: false, message: 'Email is already registered.' }, { status: 409 });
      }
      return NextResponse.json({ success: false, message: 'Username is already taken.' }, { status: 409 });
    }

    const { hash, salt } = hashPassword(password);
    const now = new Date().toISOString();

    const newUser = {
      id: uuidv4(),
      role,
      name,
      email,
      username,
      bio,
      phone,
      country,
      timezone,
      verifiedBadges: [],
      socialLinks: {
        ...(linkedin ? { linkedin } : {}),
        ...(github ? { github } : {}),
      },
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      skills: role === 'FREELANCER' ? freelancerRoleDetails.skills : [],
      portfolio: [],
      videoIntro: null,
      roleProfile: role === 'FREELANCER'
        ? freelancerRoleDetails
        : clientRoleDetails,
      onboarding: {
        profileVersion: 'premium-v1',
        termsAcceptedAt: now,
        completedAt: now,
      },
      monetization: {
        plan: 'FREE',
        verificationBadgeActive: false,
        aiProActive: false,
        aiProActivatedAt: null
      },
      passwordHash: hash,
      passwordSalt: salt,
      createdAt: now,
      updatedAt: now,
    };

    await usersCollection.insertOne(newUser);

    const safeUser = toSafeUser(newUser);
    const response = NextResponse.json({
      success: true,
      user: safeUser,
    });

    setSessionCookie(
      response,
      createSessionPayload({ userId: safeUser.id, role: safeUser.role, email: safeUser.email })
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Unable to create account right now.' },
      { status: 500 }
    );
  }
}
