import { redirect } from 'next/navigation';
import Container from 'react-bootstrap/Container';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import StatusContents from './StatusContent';

type RequestRow = {
  id: number;
  username: string;
  game: string;
  rank: string;
  status: string;
};

const StatusPage = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!dbUser) {
    redirect('/');
  }

  const requests = await prisma.request.findMany({
    where: {
      receiverId: dbUser.id,
    },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const requestRows: RequestRow[] = requests.map((request) => ({
    id: request.id,
    username:
      request.user.profile?.username ||
      request.user.email.split('@')[0],
    game: request.game,
    rank: request.rank,
    status: request.status,
  }));

  return (
    <Container className="py-4">
      <StatusContents requestRows={requestRows} />
    </Container>
  );
};

export default StatusPage;