'use client';

import { Card, Container, Image } from 'react-bootstrap';

type Player = {
  username: string;
  imageUrl?: string | null;
  game: string;
  rank: string;
};

const PlayerCard = ({ player }: { player: Player }) => (
<Card className="h-100 custom-card-body" style={{ width: '250px' }}>
  <Container className="ms-2">
  <Card.Body className="p-3">
    <Card.Title className="pb-2">{player.username}</Card.Title>
    <Image
      src={player.imageUrl || '/default-player.png'}
      width={175}
      height={175}
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
    <div>Rank: {player.rank}</div>

    <a className="pb-2" href="/auth/signin">
      Connect
    </a>

  </Card.Body>
  </Container>
</Card>
);

export default PlayerCard;