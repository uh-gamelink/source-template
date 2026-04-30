/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

{/* When user fetches their favorites library */}
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const library = await prisma.userGame.findMany({
      where: { userId: user.id },
      include: { game: true },
      orderBy: { addedAt: 'desc' },
    });

    return NextResponse.json(library.map((entry) => entry.game));
  } catch (error) {
    console.error('Error fetching library:', error);
    return NextResponse.json({ error: 'Failed to fetch library' }, { status: 500 });
  }
}

{/* When user adds game to their favorites */}
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { gameId } = body;

    if (!gameId) {
      return NextResponse.json({ error: 'gameId is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const entry = await prisma.userGame.create({
      data: { userId: user.id, gameId: parseInt(gameId) },
      include: { game: true },
    });

    return NextResponse.json(entry.game, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Game already in library' }, { status: 409 });
    }
    console.error('Error adding to library:', error);
    return NextResponse.json({ error: 'Failed to add to library' }, { status: 500 });
  }
}

{/* When user removes game from their favorites */}
export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { gameId, gameIds } = body;
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete all games
    if (Array.isArray(gameIds)) {
      if (gameIds.length === 0) {
        return NextResponse.json({ error: 'gameIds must not be empty' }, { status: 400 });
      }

      await prisma.userGame.deleteMany({
        where: {
          userId: user.id,
          gameId: { in: gameIds.map((id) => parseInt(id)) },
        },
      });

      return NextResponse.json({ message: 'Games removed from library' });
    }

    // Single game remove
    if (!gameId) {
      return NextResponse.json({ error: 'gameId is required' }, { status: 400 });
    }

    await prisma.userGame.deleteMany({
      where: { userId: user.id, gameId: parseInt(gameId) },
    });

    return NextResponse.json({ message: 'Game removed from library' });
    
  } catch (error) {
    console.error('Error removing from library:', error);
    return NextResponse.json({ error: 'Failed to remove from library' }, { status: 500 });
  }
}
