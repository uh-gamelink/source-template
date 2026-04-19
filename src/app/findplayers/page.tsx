import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Container } from 'react-bootstrap';
import PlayerCard from '@/components/PlayerCard';

const FindPlayersPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const players = await prisma.player.findMany();

  return (
    <Container className="py-4">
      <h1 className="mb-3">Find Players</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.4rem',
          justifyItems: 'center',
        }}
      >
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </Container>
  );
};

export default FindPlayersPage;