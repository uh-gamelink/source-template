import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  const requests = await prisma.request.findMany({
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json(requests);
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const { game, rank, notes } = body;

    if (!game || !rank) {
      return NextResponse.json(
        { error: 'Game and rank required' },
        { status: 400 }
      );
    }

    const newRequest = await prisma.request.create({
      data: {
        game,
        rank,
        notes,
        userId: dbUser.id,
      },
    });

    return NextResponse.json(newRequest);
  } catch (err) {
    console.error('Request error:', err);
    return NextResponse.json(
      { error: 'Failed to create request' },
      { status: 500 }
    );
  }
}