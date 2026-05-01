import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    if (session.user.role === 'ADMIN') {
      return NextResponse.json(
        {
          error:
            'Admins cannot create player listings.',
        },
        { status: 403 },
      );
    }

    const body = await request.json();

    const username = String(
      body.username ?? '',
    ).trim();

    const game = String(
      body.game ?? '',
    ).trim();

    const rank = String(
      body.rank ?? '',
    ).trim();

    if (!username || !game || !rank) {
      return NextResponse.json(
        {
          error:
            'Username, game, and rank are required.',
        },
        { status: 400 },
      );
    }

    const gameExists =
      await prisma.game.findUnique({
        where: {
          title: game,
        },
      });

    if (!gameExists) {
      return NextResponse.json(
        { error: 'Invalid game selected.' },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 },
      );
    }

    const imageUrl =
      user.profile?.profilePicture ||
      '/default-player.svg';

    const player = await prisma.player.upsert({
      where: {
        userId_game: {
          userId: user.id,
          game,
        },
      },
      update: {
        username,
        rank,
        imageUrl,
      },
      create: {
        username,
        game,
        rank,
        imageUrl,
        userId: user.id,
      },
    });

    return NextResponse.json(
      player,
      { status: 201 },
    );
  } catch (error) {
    console.error(
      'Error creating player listing:',
      error,
    );

    return NextResponse.json(
      {
        error:
          'Failed to create player listing.',
      },
      { status: 500 },
    );
  }
}