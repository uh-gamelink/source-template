import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import GameLibraryClient from '@/components/gamelibrary/GameLibraryClient';

export const dynamic = 'force-dynamic';

const GameLibraryPage = async () => {
  const session = await auth();

  if (session?.user?.role === 'ADMIN') {
    redirect('/admin/manage');
  }

  const games = await prisma.game.findMany();

  return <GameLibraryClient games={games} />;
};

export default GameLibraryPage;
