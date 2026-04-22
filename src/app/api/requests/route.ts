import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true }, // ✅ added
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const requests = await prisma.request.findMany({
      where: {
        OR: [
          { userId: dbUser.id },      // sent by me
          { receiverId: dbUser.id },  // received by me
        ],
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        receiver: {
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
  } catch (err) {
    console.error('GET requests error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const { game, rank, notes, receiverUsername } = body;

    if (!game || !rank) {
      return NextResponse.json(
        { error: 'Game and rank required' },
        { status: 400 },
      );
    }

    // ✅ Trim username to avoid mismatch bugs
    const cleanUsername = receiverUsername?.trim();

    // ✅ Resolve receiver if it's a real user
    let receiverId: number | null = null;

    if (cleanUsername) {
      const receiverUser = await prisma.user.findFirst({
        where: {
          profile: {
            username: cleanUsername,
          },
        },
      });

      if (receiverUser) {
        receiverId = receiverUser.id;
      }
    }

    // ✅ Create request (works for BOTH real + fake players)
    const newRequest = await prisma.request.create({
      data: {
        game,
        rank,
        notes,
        userId: dbUser.id,
        receiverId: receiverId, // null if not a real user
        receiverUsername: cleanUsername || null,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        receiver: {
          include: {
            profile: true,
          },
        },
      },
    });

    return NextResponse.json(newRequest);
  } catch (err) {
    console.error('POST request error:', err);
    return NextResponse.json(
      { error: 'Failed to create request' },
      { status: 500 },
    );
  }
}