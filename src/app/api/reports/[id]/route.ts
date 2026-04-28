import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { action } = await request.json();

    const report = await prisma.report.findUnique({
      where: { id: Number(id) },
    });

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found.' },
        { status: 404 },
      );
    }

    if (action === 'RESOLVED') {
      await prisma.report.update({
        where: { id: Number(id) },
        data: { status: 'RESOLVED' },
      });
    }

    if (action === 'FLAGGED') {
      await prisma.player.update({
        where: { username: report.reportedUsername },
        data: { moderationStatus: 'FLAGGED' },
      });

      await prisma.report.update({
        where: { id: Number(id) },
        data: { status: 'FLAGGED' },
      });
    }

    if (action === 'BANNED') {
      await prisma.player.update({
        where: { username: report.reportedUsername },
        data: { moderationStatus: 'BANNED' },
      });

      await prisma.report.update({
        where: { id: Number(id) },
        data: { status: 'BANNED' },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to update report.' },
      { status: 500 },
    );
  }
}