'use client';

import { useMemo, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import GameLibraryCard, { type Game } from '@/components/gamelibrary/GameLibraryCard';

const PAGE_SIZE = 6;

export default function GameLibraryClient({ games }: { games: Game[] }) {
  const [page, setPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    games.forEach((g) => g.tags.forEach((t) => tagSet.add(t)));
    return ['All', ...Array.from(tagSet)];
  }, [games]);

  const filteredGames = useMemo(() => {
    if (selectedTag === 'All') return games;
    return games.filter((g) => g.tags.includes(selectedTag));
  }, [games, selectedTag]);

  const totalPages = Math.ceil(filteredGames.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentGames = filteredGames.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">Game Library</h1>

      <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
        {allTags.map((tag) => (
          <Button
            key={tag}
            onClick={() => {
              setSelectedTag(tag);
              setPage(1);
            }}
            variant={selectedTag === tag ? 'primary' : 'outline-primary'}
            size="sm"
          >
            {tag}
          </Button>
        ))}
      </div>

      <Row className="g-4">
        {currentGames.map((game) => (
          <Col md={4} key={game.id}>
            <GameLibraryCard game={game} />
          </Col>
        ))}
      </Row>

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