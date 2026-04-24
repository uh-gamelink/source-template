'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import GameLibraryCard, { type Game } from '@/components/gamelibrary/GameLibraryCard';

export default function FavoritesClient() {
  const [favorites, setFavorites] = useState<Game[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
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
    .catch(console.error);
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
      <Row className='mt-4'>
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
  );
}