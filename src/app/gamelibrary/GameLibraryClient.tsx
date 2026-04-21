/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';

import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

type Game = {
  id: number;
  title: string;
  developer: string;
  platform?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  tags: string[];
};

interface Props {
  games: Game[];
  initialLibraryIds: number[];
}

export default function GameLibraryClient({ games, initialLibraryIds }: Props) {
  const session = useSession().data;
  const [libraryIds, setLibraryIds] = useState<Set<number>>(new Set(initialLibraryIds));
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/library')
      .then((res) => res.json())
      .then((data: Game[]) => {
        if (Array.isArray(data)) {
          setLibraryIds(new Set(data.map((g) => g.id)));
        }
      })
      .catch(console.error);
  }, []);

  // Toggles a game in or out of the Favorites library depending on the game's current state
  async function handleToggle(gameId: number) {
    setLoadingId(gameId);
    const inLibrary = libraryIds.has(gameId);

    try {
      const res = await fetch("/api/library", {
        method: inLibrary ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId }),
      });

      if (res.ok) {
        setLibraryIds((prev) => {
          const next = new Set(prev);
          inLibrary ? next.delete(gameId) : next.add(gameId);
          return next;
        });
      }
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">Game Library</h1>

      <Row className="g-4">
        {games.map((game) => {
          const inLibrary = libraryIds.has(game.id);
          const isLoading = loadingId === game.id;
          
          return (
            <Col md={4} key={game.id}>
              <Card className="h-100 shadow-sm custom-card-body">

              <Card.Img
                className="mt-5"
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
              <Card.Footer>
                {/* Visible only if logged in. */}
                {session && (
                  <Button 
                    variant={inLibrary ? "danger" : "primary"} 
                    className="w-100" 
                    onClick={() => handleToggle(game.id)}
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : inLibrary ? "Remove from Favorites" : "Add to Favorites"}
                  </Button>
                )}
              </Card.Footer>
            </Card>
          </Col>
        )})}
      </Row>
    </Container>
  );
}