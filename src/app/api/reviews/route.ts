import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await auth();
    console.log('SESSION USER:', session?.user);
    console.log('SESSION EMAIL:', session?.user?.email);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { text, rating } = await req.json();
    const numericRating = Number(rating);

    if (!text.trim() || numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { error: 'Review text and a rating from 1 to 5 are required.' },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 },
      );
    }

    const review = await prisma.review.create({
      data: {
        text: text.trim(),
        rating: numericRating,
        userId: user.id,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);

    return NextResponse.json(
      { error: 'Failed to create review.' },
      { status: 500 },
    );
  }
}
