import { redirect } from 'next/navigation';
import { PlayerModerationStatus, Prisma } from '@prisma/client';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Container from 'react-bootstrap/Container';
import FindPlayersBrowser from '@/components/FindPlayersBrowser';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 15;

type FindPlayersPageProps = {
  searchParams?: Promise<{
    page?: string;
    search?: string;
  }>;
};

const FindPlayersPage = async ({
  searchParams,
}: FindPlayersPageProps) => {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (session.user.role === 'ADMIN') {
    redirect('/admin/manage');
  }

  const params = (await searchParams) ?? {};

  const currentPage = Math.max(Number(params.page) || 1, 1);
  const search = params.search?.trim() || '';

  const where: Prisma.PlayerWhereInput = {
    ...(search
      ? {
          username: {
            contains: search,
            mode: 'insensitive',
          },
        }
      : {}),

    moderationStatus: {
      not: PlayerModerationStatus.BANNED,
    },

    NOT: [
      {
        username: {
          equals: 'admin',
          mode: 'insensitive',
        },
      },
    ],
  };

  const totalPlayers = await prisma.player.count({ where });

  const totalPages = Math.max(
    1,
    Math.ceil(totalPlayers / PAGE_SIZE),
  );

  const safePage = Math.min(currentPage, totalPages);

  const players = await prisma.player.findMany({
    where,
    skip: (safePage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    orderBy: {
      username: 'asc',
    },
  });

  const games = await prisma.game.findMany({
    orderBy: {
      title: 'asc',
    },
    select: {
      title: true,
    },
  });

  const gameTitles = games.map((game) => game.title);

  const startItem =
    totalPlayers === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;

  const endItem = Math.min(safePage * PAGE_SIZE, totalPlayers);

  return (
    <Container className="py-4">
      <FindPlayersBrowser
        players={players}
        games={gameTitles}
        currentPage={safePage}
        totalPages={totalPages}
        totalPlayers={totalPlayers}
        startItem={startItem}
        endItem={endItem}
        search={search}
      />
    </Container>
    
  );
};

export default FindPlayersPage;
