'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import PlayerCard from '@/components/PlayerCard';
import { Search } from 'react-bootstrap-icons';

type Player = {
  id: number;
  username: string;
  imageUrl?: string | null;
  game: string;
  rank: string;
};

type FindPlayersBrowserProps = {
  players: Player[];
  totalPlayers: number;
  game: string;
  rank: string;
  safePage: number;
  totalPages: number;
};

const FindPlayersBrowser = ({
  players,
  totalPlayers,
  game,
  rank,
  safePage,
  totalPages,
}: FindPlayersBrowserProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const createPageLink = (page: number) => {
    const query = new URLSearchParams();

    if (game) query.set('game', game);
    if (rank) query.set('rank', rank);
    query.set('page', String(page));

    return `/findplayers?${query.toString()}`;
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-3">
        <div>
          <h1 className="mb-1">Find Players</h1>
          <p className="mb-0">Click on the plus icon to request other players.</p>
        </div>

        <div className="position-relative">
          <Link href="/requests">
            <Button className="custom-tag-btn">Create Request</Button>
          </Link>

          <button
            type="button"
            className="filter-toggle-btn position-absolute ms-4"
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Toggle filters"
          >
            <Search size={20} />
          </button>

          {showFilters && (
            <div className="filter-dropdown shadow-sm p-3">
              <form method="GET" className="d-flex flex-column gap-3">
                <div>
                  <label htmlFor="game" className="form-label mb-1">
                    Game Title
                  </label>
                  <input
                    id="game"
                    name="game"
                    type="text"
                    defaultValue={game}
                    placeholder="Search by game"
                    className="form-control custom-card-body"
                  />
                </div>

                <div>
                  <label htmlFor="rank" className="form-label mb-1">
                    Rank
                  </label>
                  <input
                    id="rank"
                    name="rank"
                    type="text"
                    defaultValue={rank}
                    placeholder="Search by rank"
                    className="form-control custom-card-body"
                  />
                </div>

                <div className="d-flex gap-2">
                  <Button type="submit" className="custom-tag-btn border-0">
                    Filter
                  </Button>

                  <Link href="/findplayers" className="btn custom-reset-btn">
                    Reset
                  </Link>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* PLAYER GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.4rem',
          justifyItems: 'center',
        }}
      >
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>

      {/* COUNT */}
      <p className="mb-3 text-center pt-3">
        Showing {players.length} of {totalPlayers} player{totalPlayers === 1 ? '' : 's'}
      </p>

      {/* PAGINATION */}
      <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
        {safePage > 1 ? (
          <Link href={createPageLink(safePage - 1)} className="btn btn-outline-primary">
            Previous
          </Link>
        ) : (
          <Button disabled variant="outline-primary">
            Previous
          </Button>
        )}

        <span>
          Page {safePage} of {totalPages}
        </span>

        {safePage < totalPages ? (
          <Link href={createPageLink(safePage + 1)} className="btn btn-outline-primary">
            Next
          </Link>
        ) : (
          <Button disabled variant="outline-primary">
            Next
          </Button>
        )}
      </div>
    </>
  );
};

export default FindPlayersBrowser;