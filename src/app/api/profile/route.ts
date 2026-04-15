import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be signed in to update your profile.' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { description, interests, profilePicture } = body;

    if (!description || !interests) {
      return NextResponse.json(
        { error: 'Description and interests are required.' },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 },
      );
    }

    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        description,
        interests,
        profilePicture,
      },
      create: {
        description,
        interests,
        profilePicture,
        userId: user.id,
      },
    });

    return NextResponse.json(
      { message: 'Profile updated successfully.', profile },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile.' },
      { status: 500 },
    );
  }
}