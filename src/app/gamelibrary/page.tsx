import { prisma } from '@/lib/prisma';
import GameLibraryClient from '@/components/gamelibrary/GameLibraryClient';

const GameLibraryPage = async () => {
  const games = await prisma.game.findMany();

  return <GameLibraryClient games={games} />;
};

export default GameLibraryPage;