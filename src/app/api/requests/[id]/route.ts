import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be signed in.' },
        { status: 401 },
      );
    }

    const { id } = await params;
    const requestId = Number(id);

    if (Number.isNaN(requestId)) {
      return NextResponse.json(
        { error: 'Invalid request id.' },
        { status: 400 },
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 },
      );
    }

    const existingRequest = await prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Request not found.' },
        { status: 404 },
      );
    }

    if (existingRequest.userId !== dbUser.id) {
      return NextResponse.json(
        { error: 'You can only delete your own requests.' },
        { status: 403 },
      );
    }

    await prisma.request.delete({
      where: { id: requestId },
    });

    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting request:', error);
    return NextResponse.json(
      { error: 'Failed to delete request.' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be signed in.' },
        { status: 401 },
      );
    }

    const { id } = await params;
    const requestId = Number(id);

    if (Number.isNaN(requestId)) {
      return NextResponse.json(
        { error: 'Invalid request id.' },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { status } = body;

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status.' },
        { status: 400 },
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 },
      );
    }

    const existingRequest = await prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Request not found.' },
        { status: 404 },
      );
    }

    if (existingRequest.receiverId !== dbUser.id) {
      return NextResponse.json(
        { error: 'Only the receiver can update this request.' },
        { status: 403 },
      );
    }

    const updatedRequest = await prisma.request.update({
      where: { id: requestId },
      data: { status },
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