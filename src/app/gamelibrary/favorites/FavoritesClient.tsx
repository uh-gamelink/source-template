'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import GameLibraryCard, { type Game } from '@/components/gamelibrary/GameLibraryCard';

export default function FavoritesClient() {
  const [favorites, setFavorites] = useState<Game[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/library')
      .then((res) => res.json())
      .then((data: Game[]) => {
        if (Array.isArray(data)) {
          setFavorites(data);
        }
      })
      .catch(console.error);
  }, []);

  async function handleRemove(gameId: number) {
    setLoadingId(gameId);

    try {
      const res = await fetch('/api/library', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId }),
      });

      if (res.ok) {
        setFavorites((prev) => prev.filter((game) => game.id !== gameId));
      }
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Favorites</h1>

      {favorites.length === 0 ? (
        <p>No favorite games yet.</p>
      ) : (
        <Row className="g-4">
          {favorites.map((game) => (
            <Col md={4} key={game.id}>
              <GameLibraryCard
                game={game}
                inLibrary
                isLoading={false}
                onToggleLibrary={() => {}}
                isLoggedIn
              />

              <Button
                className="custom-reg-btn mt-2 w-100"
                disabled={loadingId === game.id}
                onClick={() => handleRemove(game.id)}
              >
                {loadingId === game.id ? 'Removing...' : 'Remove from Favorites'}
              </Button>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}