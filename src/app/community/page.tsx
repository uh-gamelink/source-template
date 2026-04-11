import type { Metadata } from 'next';
import { Container, Row, Col } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import PlayerCard from '@/components/PlayerCard';


export const metadata: Metadata = {
  title: 'Community',
};

const CommunityPage = async () => {
  const players = await prisma.player.findMany();

  return (
    <Container className="py-4">
      <h1 className=" mb-3">Community Players</h1>
      <Row className="g-3">
        {players.map((player) => (
           <Col key={player.id} xs={12} md={6} lg={4}>
            <PlayerCard player={player} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CommunityPage;