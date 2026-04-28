import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ✅ IMPORTANT FIX (Next 15 requirement)
  const { id } = await params;

  const reviewId = Number(id);
  const userId = Number(session.user.id);

  if (Number.isNaN(reviewId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (review.userId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });

  return NextResponse.json({ success: true });
}