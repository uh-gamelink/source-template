import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 },
      );
    }

    const requests = await prisma.request.findMany({
      where: {
        OR: [
          {
            userId: dbUser.id,
          },
          {
            receiverId: dbUser.id,
          },
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

    const requestRows = requests.map((request) => ({
      ...request,
      direction:
        request.receiverId === dbUser.id
          ? 'incoming'
          : 'outgoing',
    }));

    return NextResponse.json(requestRows);
  } catch (error) {
    console.error('Error fetching requests:', error);

    return NextResponse.json(
      { error: 'Failed to fetch requests.' },
      { status: 500 },
    );
  }
}

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
            'Admins cannot send player requests.',
        },
        { status: 403 },
      );
    }

    const body = await request.json();

    const receiverPlayerId = Number(
      body.receiverPlayerId,
    );

    const requesterUsername = String(
      body.requesterUsername ?? '',
    ).trim();

    const requesterRank = String(
      body.requesterRank ?? '',
    ).trim();

    const notes = String(
      body.notes ?? '',
    ).trim();

    if (!receiverPlayerId) {
      return NextResponse.json(
        { error: 'Missing receiver player listing.' },
        { status: 400 },
      );
    }

    if (!requesterUsername || !requesterRank) {
      return NextResponse.json(
        {
          error:
            'Your username and rank are required.',
        },
        { status: 400 },
      );
    }

    const sender = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!sender) {
      return NextResponse.json(
        { error: 'Sender not found.' },
        { status: 404 },
      );
    }

    const receiverPlayer =
      await prisma.player.findUnique({
        where: {
          id: receiverPlayerId,
        },
      });

    if (!receiverPlayer) {
      return NextResponse.json(
        { error: 'Player listing not found.' },
        { status: 404 },
      );
    }

    if (receiverPlayer.userId === sender.id) {
      return NextResponse.json(
        { error: 'You cannot request yourself.' },
        { status: 400 },
      );
    }

    const existingPendingRequest =
      await prisma.request.findFirst({
        where: {
          userId: sender.id,
          receiverId: receiverPlayer.userId,
          game: receiverPlayer.game,
          status: 'PENDING',
        },
      });

    if (existingPendingRequest) {
      return NextResponse.json(
        {
          error:
            'You already have a pending request for this player and game.',
        },
        { status: 409 },
      );
    }

    const createdRequest =
      await prisma.request.create({
        data: {
          game: receiverPlayer.game,

          // This keeps the receiver/listing owner's rank.
          rank: receiverPlayer.rank,

          // These are the sender's typed request details.
          requesterUsername,
          requesterRank,

          notes,
          userId: sender.id,
          receiverId: receiverPlayer.userId,
          receiverUsername: receiverPlayer.username,
        },
      });

    return NextResponse.json(
      createdRequest,
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating request:', error);

    return NextResponse.json(
      { error: 'Failed to create request.' },
      { status: 500 },
    );
  }
}