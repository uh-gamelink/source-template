import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be signed in.' },
        { status: 401 }
      );
    }

    const { description, interests, profilePicture, username } =
      await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return NextResponse.json(
        { error: 'Profile not found.' },
        { status: 404 }
      );
    }

    // 🔥 CRITICAL FIX: update by PROFILE ID (not userId)
    const updated = await prisma.profile.update({
      where: {
        id: user.profile.id, // ✅ THIS FIXES EVERYTHING
      },
      data: {
        description,
        interests,
        profilePicture,
        username,
      },
    });

    return NextResponse.json(updated);

  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'Username already taken.' },
        { status: 400 }
      );
    }

    console.error(error);

    return NextResponse.json(
      { error: 'Failed to update profile.' },
      { status: 500 }
    );
  }
}