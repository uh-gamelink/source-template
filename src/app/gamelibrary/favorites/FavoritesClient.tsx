'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import GameLibraryCard, { type Game } from '@/components/gamelibrary/GameLibraryCard';

export default function FavoritesClient() {
  const [favorites, setFavorites] = useState<Game[]>([]);

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
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}