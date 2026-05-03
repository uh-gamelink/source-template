import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { reportedUsername, issue, incidentDate } = await request.json();

    if (!reportedUsername || !issue || !incidentDate) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 },
      );
    }

    const trimmedUsername = reportedUsername.trim();

    const player = await prisma.player.findFirst({
      where: {
        username: trimmedUsername,
      },
    });

    if (!player) {
      return NextResponse.json(
        {
          error:
            'Player not found. Please reconfirm with the correct username.',
        },
        { status: 404 },
      );
    }

    const report = await prisma.report.create({
      data: {
        reportedUsername: trimmedUsername,
        issue,
        incidentDate: new Date(incidentDate),
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create report.' },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      where: {
        status: 'PENDING',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to load reports.' },
      { status: 500 },
    );
  }
}
