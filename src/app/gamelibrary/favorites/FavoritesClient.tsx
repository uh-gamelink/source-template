'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import GameLibraryCard, { type Game } from '@/components/gamelibrary/GameLibraryCard';
import PopUpFavoritesClient from './PopUpFavoritesClient';

export default function FavoritesClient() {
  const [favorites, setFavorites] = useState<Game[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    fetch('/api/library')
      .then((res) => res.json())
      .then((data: Game[]) => {
        if (Array.isArray(data)) {
          setFavorites(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [status]);

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
  <>
    {loading ? (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <Spinner animation="border" />
      </div>
    ) : (
      <Container className="py-4">
        <Row className="align-items-center mb-4">
          <Col className="text-start">
            <h1>Favorites</h1>
          </Col>
          <Col className="text-end">
            <PopUpFavoritesClient onRemove={handleRemove} />
          </Col>
        </Row>

        {favorites.length === 0 ? (
          <div className="text-center py-4">
            <p>No favorite games yet.</p>
          </div>
        ) : (
          <Row className="g-4">
            {favorites.map((game) => (
              <Col md={4} key={game.id}>
                <GameLibraryCard
                  game={game}
                  inLibrary
                  isLoading={loadingId === game.id}
                  onToggleLibrary={() => {}}
                  isLoggedIn
                  isFavoritesPage
                  onRemove={handleRemove}
                />
              </Col>
            ))}
          </Row>
        )}

        <Row className="mt-4">
          <p>
            Return to
            <Link href="/gamelibrary">
              <Button className="custom-reset-btn ms-2">
                Game Library
              </Button>
            </Link>
          </p>
        </Row>
      </Container>
    )}
  </>
  );
}