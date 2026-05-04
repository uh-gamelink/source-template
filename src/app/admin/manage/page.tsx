import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ManageClient from './ManageClient';

export const dynamic = 'force-dynamic';

export default async function AdminManagePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const games = await prisma.game.findMany({
    orderBy: {
      title: 'asc',
    },
    include: {
      _count: {
        select: {
          userGames: true,
        },
      },
    },
  });

  const servers = await prisma.communityServer.findMany({
    orderBy: [
      {
        featured: 'desc',
      },
      {
        name: 'asc',
      },
    ],
    include: {
      _count: {
        select: {
          savedByUsers: true,
        },
      },
    },
  });

  const players = await prisma.player.findMany({
    orderBy: {
      id: 'asc',
    },
  });

  return <ManageClient games={games} servers={servers} players={players}/>;
}
