'use client';

import Link from 'next/link';
import { Card, Container, Image, Button } from 'react-bootstrap';

type Player = {
  username: string;
  imageUrl?: string | null;
  game: string;
  rank: string;
};

const PlayerCard = ({ player }: { player: Player }) => (
  <Card className="h-100 custom-card-body" style={{ width: '235px' }}>
    <Container className="ms-2">
      <Card.Body className="p-3">
        <Card.Title className="pb-2">{player.username}</Card.Title>

        <Image
          src={player.imageUrl || '/default-player.png'}
          width={155}
          height={160}
          rounded
          alt={player.username}
          style={{
            objectFit: 'cover',
            borderRadius: '12px',
            border: '4px solid #b0e0e682',
          }}
          className="mb-3"
        />

        <div>Game: {player.game}</div>
        <div className="mb-2">Rank: {player.rank}</div>

        
        <Link
          href={`/requests?game=${encodeURIComponent(
            player.game
          )}&rank=${encodeURIComponent(player.rank)}`}
        >
          <Button size="sm">Connect</Button>
        </Link>
      </Card.Body>
    </Container>
  </Card>
);

export default PlayerCard;