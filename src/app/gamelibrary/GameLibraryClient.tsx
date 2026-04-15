'use client';

import { Container, Row, Col, Card } from 'react-bootstrap';

type Game = {
  id: number;
  title: string;
  developer: string;
  platform?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  tags: string[];
};

export default function GameLibraryClient({ games }: { games: Game[] }) {
  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">Game Library</h1>

      <Row className="g-4">
        {games.map((game) => (
          <Col md={4} key={game.id}>
            <Card className="h-100 shadow-sm custom-card-body">

              <Card.Img
                variant="top"
                src={game.imageUrl || ''}
                style={{
                  height: '160px',
                  objectFit: 'contain',
                  padding: '10px',
                }}
              />

              <Card.Body>
                <Card.Title>{game.title}</Card.Title>

                <Card.Text>
                  <strong>Developer:</strong> {game.developer}
                </Card.Text>

                {game.platform && (
                  <Card.Text>
                    <strong>Platform:</strong> {game.platform}
                  </Card.Text>
                )}

                {game.description && (
                  <Card.Text>{game.description}</Card.Text>
                )}

                <div>
                  {game.tags.map((tag) => (
                    <span key={tag} className="badge custom-tag-btn me-1">
                      {tag}
                    </span>
                  ))}
                </div>

              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}