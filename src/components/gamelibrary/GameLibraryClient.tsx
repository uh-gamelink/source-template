'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
} from 'react-bootstrap';
import GameLibraryCard, {
  type Game,
} from '@/components/gamelibrary/GameLibraryCard';
import { useSession } from 'next-auth/react';

const PAGE_SIZE = 6;

export default function GameLibraryClient({
  games,
}: {
  games: Game[];
}) {
  const [page, setPage] =
    useState(1);

  const [selectedTag, setSelectedTag] =
    useState<string>('All');

  const [searchTerm, setSearchTerm] =
    useState('');

  const [libraryIds, setLibraryIds] =
    useState<Set<number>>(
      new Set(),
    );

  const [loadingId, setLoadingId] =
    useState<number | null>(null);

  const [showFavorites, setShowFavorites] =
    useState(false);

  const { status } = useSession();

  const isLoggedIn =
    status === 'authenticated';

  useEffect(() => {
    if (!isLoggedIn) return;

    fetch('/api/library')
      .then((res) => res.json())
      .then((data: Game[]) => {
        if (
          Array.isArray(data)
        ) {
          setLibraryIds(
            new Set(
              data.map(
                (g) => g.id,
              ),
            ),
          );
        }
      })
      .catch(console.error);
  }, [isLoggedIn, status]);

  async function handleAdd(
    gameId: number,
  ) {
    setLoadingId(gameId);

    try {
      const res = await fetch(
        '/api/library',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify(
            {
              gameId,
            },
          ),
        },
      );

      if (res.ok) {
        setLibraryIds(
          (prev) => {
            const next =
              new Set(
                prev,
              );

            next.add(
              gameId,
            );

            return next;
          },
        );
      }
    } finally {
      setLoadingId(null);
    }
  }

  const sortedGames =
    useMemo(() => {
      return [
        ...games,
      ].sort((a, b) =>
        a.title.localeCompare(
          b.title,
        ),
      );
    }, [games]);

  const allTags =
    useMemo(() => {
      const tagSet =
        new Set<string>();

      games.forEach((g) =>
        g.tags.forEach((t) =>
          tagSet.add(t),
        ),
      );

      return [
        'All',
        ...Array.from(
          tagSet,
        ),
      ];
    }, [games]);

  const filteredGames =
    useMemo(() => {
      return sortedGames.filter(
        (g) => {
          const matchesTag =
            selectedTag ===
              'All' ||
            g.tags.includes(
              selectedTag,
            );

          const matchesSearch =
            g.title
              .toLowerCase()
              .includes(
                searchTerm.toLowerCase(),
              ) ||
            g.developer
              .toLowerCase()
              .includes(
                searchTerm.toLowerCase(),
              );

          const matchesFavorites =
            !showFavorites ||
            libraryIds.has(
              g.id,
            );

          return (
            matchesTag &&
            matchesSearch &&
            matchesFavorites
          );
        },
      );
    }, [
      sortedGames,
      selectedTag,
      searchTerm,
      showFavorites,
      libraryIds,
    ]);

  const totalPages =
    Math.ceil(
      filteredGames.length /
        PAGE_SIZE,
    ) || 1;

  const startIndex =
    (page - 1) *
    PAGE_SIZE;

  const currentGames =
    filteredGames.slice(
      startIndex,
      startIndex +
        PAGE_SIZE,
    );

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">
        Game Library
      </h1>

      {/* Search + Favorites */}
      <div className="d-flex justify-content-center align-items-center gap-3 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(
              e.target.value,
            );
            setPage(1);
          }}
          className="form-control"
          style={{
            maxWidth:
              '700px',
          }}
        />

        <Button
          onClick={() => {
            setShowFavorites(
              !showFavorites,
            );
            setPage(1);
          }}
          style={{
            minWidth:
              '180px',
            height: '46px',
            fontWeight: 700,
            borderRadius:
              '12px',
            whiteSpace:
              'nowrap',
            border: 'none',
            backgroundColor:
              showFavorites
                ? '#ffc107'
                : '#4d8dff',
            color:
              showFavorites
                ? '#111'
                : 'white',
            boxShadow:
              '0 4px 12px rgba(0,0,0,0.25)',
          }}
        >
          {showFavorites
            ? 'Show All Games'
            : 'View Favorites'}
        </Button>
      </div>

      {/* Tags */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
        {allTags.map(
          (tag) => (
            <Button
  key={tag}
  onClick={() => {
    setSelectedTag(tag);
    setPage(1);
  }}
  className={`btn tag-btn ${
    selectedTag === tag ? 'active' : ''
  }`}
  size="sm"
>
  {tag}
</Button>
          ),
        )}
      </div>

      {/* Games */}
      <Row className="g-4">
        {currentGames.map(
          (game) => (
            <Col
              md={4}
              key={
                game.id
              }
            >
              <GameLibraryCard
                game={
                  game
                }
                inLibrary={libraryIds.has(
                  game.id,
                )}
                isLoading={
                  loadingId ===
                  game.id
                }
                onToggleLibrary={
                  handleAdd
                }
                isLoggedIn={
                  isLoggedIn
                }
              />
            </Col>
          ),
        )}
      </Row>

      {/* Empty */}
      {currentGames.length ===
        0 && (
        <p className="text-center mt-4">
          No games found.
        </p>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
        <Button
          variant="primary"
          disabled={
            page === 1
          }
          onClick={() =>
            setPage(
              (p) =>
                p - 1,
            )
          }
        >
          Prev
        </Button>

        <span>
          Page {page} of{' '}
          {
            totalPages
          }
        </span>

        <Button
          variant="primary"
          disabled={
            page >=
            totalPages
          }
          onClick={() =>
            setPage(
              (p) =>
                p + 1,
            )
          }
        >
          Next
        </Button>
      </div>
    </Container>
  );
}