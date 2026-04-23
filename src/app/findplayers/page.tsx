import { redirect } from 'next/navigation';
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

  const params = (await searchParams) ?? {};

  const currentPage = Math.max(
    Number(params.page) || 1,
    1,
  );

  const search =
    params.search?.trim() || '';

  const where = search
    ? {
        username: {
          contains: search,
          mode: 'insensitive' as const,
        },
      }
    : {};

  const totalPlayers =
    await prisma.player.count({
      where,
    });

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalPlayers / PAGE_SIZE,
    ),
  );

  const safePage = Math.min(
    currentPage,
    totalPages,
  );

  const players =
    await prisma.player.findMany({
      where,
      skip:
        (safePage - 1) *
        PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: {
        username: 'asc',
      },
    });

  const startItem =
    totalPlayers === 0
      ? 0
      : (safePage - 1) *
          PAGE_SIZE +
        1;

  const endItem = Math.min(
    safePage * PAGE_SIZE,
    totalPlayers,
  );

  return (
    <Container className="py-4">
      <FindPlayersBrowser
        players={players}
        currentPage={safePage}
        totalPages={totalPages}
        totalPlayers={
          totalPlayers
        }
        startItem={startItem}
        endItem={endItem}
        search={search}
      />
    </Container>
  );
};

export default FindPlayersPage;