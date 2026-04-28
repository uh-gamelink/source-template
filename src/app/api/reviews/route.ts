import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { text, rating } = await req.json();

  const review = await prisma.review.create({
    data: {
      text,
      rating,
      userId: Number(session.user.id),
    },
  });

  return NextResponse.json(review);
}