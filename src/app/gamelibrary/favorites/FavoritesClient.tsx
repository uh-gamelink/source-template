'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Button } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import GameLibraryCard, { type Game } from '@/components/gamelibrary/GameLibraryCard';
import { useRemoveFromLibrary } from './RemoveFromLibrary';

const PAGE_SIZE = 6;

export default function FavoritesClient() {
  const [favorites, setFavorites] = useState<Game[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const { status } = useSession();
  const router = useRouter();

  const { removeSingle } = useRemoveFromLibrary((gameIds) => {
    setFavorites((prev) => prev.filter((g) => !gameIds.includes(g.id)));
  });

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
      await removeSingle(gameId);
    } finally {
      setLoadingId(null);
    }
  }

  const totalPages = Math.ceil(favorites.length / PAGE_SIZE) || 1;
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentFavorites = favorites.slice(startIndex, startIndex + PAGE_SIZE);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '60vh' }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container className="py-4">
      <Row className="align-items-center mb-4">
        <Col className="text-start">
          <h1>Favorites</h1>
        </Col>
          <Col className="text-end">
          <Link href="/gamelibrary" className="btn custom-home-btn">
            Return to Game Library
          </Link>
        </Col>
      </Row>

      {favorites.length === 0 ? (
        <div className="text-center py-4">
          <p>No favorite games yet.</p>
        </div>
      ) : (
        <>
          <Row className="g-4">
            {currentFavorites.map((game) => (
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

          <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
            <Button
              className="custom-home-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>

            <span>
              Page {page} of {totalPages}
            </span>

            <Button
              className="custom-home-btn"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}
