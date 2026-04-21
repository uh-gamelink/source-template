'use client';

import { useMemo, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

type Game = {
  id: number;
  title: string;
  developer: string;
  platform?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  tags: string[];
};

const PAGE_SIZE = 6;

export default function GameLibraryClient({ games }: { games: Game[] }) {
  const [page, setPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    games.forEach((g) => g.tags.forEach((t) => tagSet.add(t)));
    return ['All', ...Array.from(tagSet)];
  }, [games]);

  // FILTER FIRST
  const filteredGames = useMemo(() => {
    if (selectedTag === 'All') return games;
    return games.filter((g) => g.tags.includes(selectedTag));
  }, [games, selectedTag]);

  // RESET PAGE WHEN FILTER CHANGES
  const totalPages = Math.ceil(filteredGames.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentGames = filteredGames.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">Game Library</h1>

      {/* TAG FILTER BUTTONS */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
        {allTags.map((tag) => (
          <Button
            key={tag}
            onClick={() => {
              setSelectedTag(tag);
              setPage(1); // reset pagination
            }}
            variant={selectedTag === tag ? 'primary' : 'outline-primary'}
            size="sm"
          >
            {tag}
          </Button>
        ))}
      </div>

      {/* GAME GRID */}
      <Row className="g-4">
        {currentGames.map((game) => (
          <Col md={4} key={game.id}>
            <Card className="h-100 custom-card-body request-card">

              {game.imageUrl && (
                <Card.Img
                  variant="top"
                  src={game.imageUrl}
                  className="game-card-img"
                />
              )}

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

                <div className="mt-2">
                  {game.tags.map((tag) => (
                    <span key={tag} className="badge custom-tag-btn me-1 mb-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* PAGINATION */}
      <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
        <Button
          variant="primary"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </Button>

        <span>
          Page {page} of {totalPages || 1}
        </span>

        <Button
          variant="primary"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </Container>
  );
}