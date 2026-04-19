import Link from 'next/link';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import PlayerCard from '@/components/PlayerCard';

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

const FindPlayerBrowser = ({
  players,
  totalPlayers,
  game,
  rank,
  safePage,
  totalPages,
}: FindPlayersBrowserProps) => {
  const createPageLink = (page: number) => {
    const query = new URLSearchParams();

    if (game) query.set('game', game);
    if (rank) query.set('rank', rank);
    query.set('page', String(page));

    return `/findplayers?${query.toString()}`;
  };

  return (
    <>
      <form method="GET" className="mb-4">
        <Row className="g-3 align-items-end">
          <Col md={4}>
            <label htmlFor="game" className="form-label">
              Game Title
            </label>
            <input
              id="game"
              name="game"
              type="text"
              defaultValue={game}
              placeholder="Search by game"
              className="form-control"
            />
          </Col>

          <Col md={4}>
            <label htmlFor="rank" className="form-label">
              Rank
            </label>
            <input
              id="rank"
              name="rank"
              type="text"
              defaultValue={rank}
              placeholder="Search by rank"
              className="form-control"
            />
          </Col>

          <Col md="auto">
            <Button type="submit" className="custom-tag-btn border-0">
              Filter
            </Button>
          </Col>

          <Col md="auto">
            <Link href="/findplayers" className="btn btn-outline-secondary">
              Reset
            </Link>
          </Col>
        </Row>
      </form>

      <p className="mb-3">
        Showing {players.length} of {totalPlayers} player{totalPlayers === 1 ? '' : 's'}.
      </p>

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

export default FindPlayerBrowser;