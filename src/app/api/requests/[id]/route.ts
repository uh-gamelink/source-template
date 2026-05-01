import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type RequestRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: RequestRouteProps,
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { id } = await params;
    const requestId = Number(id);

    if (!requestId) {
      return NextResponse.json(
        { error: 'Invalid request id.' },
        { status: 400 },
      );
    }

    const body = await request.json();

    const status = String(body.status ?? '');

    if (
      status !== 'ACCEPTED' &&
      status !== 'REJECTED'
    ) {
      return NextResponse.json(
        { error: 'Invalid status.' },
        { status: 400 },
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

    const existingRequest =
      await prisma.request.findUnique({
        where: {
          id: requestId,
        },
      });

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Request not found.' },
        { status: 404 },
      );
    }

    if (existingRequest.receiverId !== dbUser.id) {
      return NextResponse.json(
        {
          error:
            'You can only update requests sent to you.',
        },
        { status: 403 },
      );
    }

    const updatedRequest =
      await prisma.request.update({
        where: {
          id: requestId,
        },
        data: {
          status,
        },
      });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Error updating request:', error);

    return NextResponse.json(
      { error: 'Failed to update request.' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RequestRouteProps,
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { id } = await params;
    const requestId = Number(id);

    if (!requestId) {
      return NextResponse.json(
        { error: 'Invalid request id.' },
        { status: 400 },
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

    const existingRequest =
      await prisma.request.findUnique({
        where: {
          id: requestId,
        },
      });

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Request not found.' },
        { status: 404 },
      );
    }

    if (existingRequest.userId !== dbUser.id) {
      return NextResponse.json(
        {
          error:
            'You can only delete requests you sent.',
        },
        { status: 403 },
      );
    }

    await prisma.request.delete({
      where: {
        id: requestId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error deleting request:', error);

    return NextResponse.json(
      { error: 'Failed to delete request.' },
      { status: 500 },
    );
  }
}