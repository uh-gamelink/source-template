import type { Metadata } from 'next';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Game Library',
};

const GameLibraryPage = async () => {
  const games = await prisma.game.findMany();

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">Game Library</h1>

      <Row className="g-4">
        {games.map((game: typeof games[number]) => (
          <Col md={4} key={game.id}>
            <Card className="h-100 shadow-sm">
              {game.imageUrl && (
                <Card.Img
                  variant="top"
                  src={game.imageUrl}
                  style={{ height: '150px', objectFit: 'contain', padding: '10px' }}
                />
              )}
              <Card.Body>
                <Card.Title>{game.title}</Card.Title>
                <Card.Text>{game.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default GameLibraryPage;