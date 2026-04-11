'use client';

import { Card, Image } from 'react-bootstrap';

type Player = {
  username: string;
  imageUrl?: string;
  game: string;
  rank: string;
};

const PlayerCard = ({ player }: { player: Player }) => (
  <Card className="h-100 text-center">
    <Card.Header>
      <Image
        src={player.imageUrl || '/default-player.png'}
        width={100}
        height={100}
        roundedCircle
        alt={player.username}
      />
    </Card.Header>

    <Card.Body>
      <Card.Title>{player.username}</Card.Title>
      <Card.Text>
        {player.game}
        <br />
        {player.rank}
      </Card.Text>
    </Card.Body>
  </Card>
);

export default PlayerCard;