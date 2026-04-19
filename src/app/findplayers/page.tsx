import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Container from 'react-bootstrap/Container';
import FindPlayersBrowser from '@/components/FindPlayerBrowser';

const PAGE_SIZE = 20;

type FindPlayersPageProps = {
  searchParams?: Promise<{
    game?: string;
    rank?: string;
    page?: string;
  }>;
};

const FindPlayerPage = async ({ searchParams }: FindPlayersPageProps) => {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const params = (await searchParams) ?? {};
  const game = params.game?.trim() ?? '';
  const rank = params.rank?.trim() ?? '';
  const currentPage = Math.max(Number(params.page) || 1, 1);

  const where = {
    ...(game
      ? {
          game: {
            contains: game,
            mode: 'insensitive' as const,
          },
        }
      : {}),
    ...(rank
      ? {
          rank: {
            contains: rank,
            mode: 'insensitive' as const,
          },
        }
      : {}),
  };

  const totalPlayers = await prisma.player.count({ where });

  const totalPages = Math.max(1, Math.ceil(totalPlayers / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const players = await prisma.player.findMany({
    where,
    skip: (safePage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    orderBy: {
      username: 'asc',
    },
  });

  return (
    <Container className="py-4">
      <h1 className="mb-3">Find Players</h1>
      <p className="mb-4">Click on the plus icon to request other players.</p>

      <FindPlayersBrowser
        players={players}
        totalPlayers={totalPlayers}
        game={game}
        rank={rank}
        safePage={safePage}
        totalPages={totalPages}
      />
    </Container>
  );
};

export default FindPlayerPage;