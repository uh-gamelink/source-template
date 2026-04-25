import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be signed in.' },
        { status: 401 },
      );
    }

    const { description, interests, profilePicture, username } =
      await request.json();

    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        {
          error:
            'Username must be 3–20 characters, no spaces, only letters, numbers, or underscores.',
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 },
      );
    }

    if (user.profile) {
      return NextResponse.json(
        { error: 'Profile already exists.' },
        { status: 409 },
      );
    }

    const created = await prisma.profile.create({
      data: {
        userId: user.id,
        username,
        description: description || '',
        interests: interests || '',
        profilePicture: profilePicture || null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'Username already taken.' },
        { status: 400 },
      );
    }

    console.error(error);

    return NextResponse.json(
      { error: 'Failed to create profile.' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be signed in.' },
        { status: 401 },
      );
    }

    const { description, interests, profilePicture, username } =
      await request.json();

    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        {
          error:
            'Username must be 3–20 characters, no spaces, only letters, numbers, or underscores.',
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return NextResponse.json(
        { error: 'Profile not found.' },
        { status: 404 },
      );
    }

    const updated = await prisma.profile.update({
      where: {
        id: user.profile.id,
      },
      data: {
        description: description || '',
        interests: interests || '',
        profilePicture: profilePicture || null,
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
        { status: 400 },
      );
    }

    console.error(error);

    return NextResponse.json(
      { error: 'Failed to update profile.' },
      { status: 500 },
    );
  }
}