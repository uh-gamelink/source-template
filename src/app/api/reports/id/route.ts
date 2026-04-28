import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    const updatedReport = await prisma.report.update({
      where: { id: Number(id) },
      data: { status },
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to update report.' },
      { status: 500 },
    );
  }
}
