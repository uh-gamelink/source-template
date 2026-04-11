import type { Metadata } from 'next';
import { Container } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import PlayerCard from '@/components/PlayerCard';

export const metadata: Metadata = {
  title: 'Community',
};

const CommunityPage = async () => {
  const players = await prisma.player.findMany();

  return (
    <Container className="py-4">
      <br />
      <h1 className="mb-3">Community Players</h1>
       <div />
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

export default CommunityPage;