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
        {games.map((game: typeof games[0]) => (
          <Col md={4} key={game.id}>
            <Card className="h-100 shadow-sm">

              {/* Image */}
              {game.imageUrl && (
                <Card.Img
                  variant="top"
                  src={game.imageUrl}
                  style={{
                    height: '160px',
                    objectFit: 'contain',
                    padding: '10px',
                  }}
                />
              )}

              <Card.Body>
                {/* Title */}
                <Card.Title>{game.title}</Card.Title>

                {/* Developer */}
                <Card.Text>
                  <strong>Developer:</strong> {game.developer}
                </Card.Text>

                {/* Platform (optional) */}
                {game.platform && (
                  <Card.Text>
                    <strong>Platform:</strong> {game.platform}
                  </Card.Text>
                )}

                {/* Description */}
                {game.description && (
                  <Card.Text>{game.description}</Card.Text>
                )}

                {/* Tags */}
                {game.tags && game.tags.length > 0 && (
                  <div className="mt-2">
                    {game.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="badge bg-secondary me-1 mb-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default GameLibraryPage;