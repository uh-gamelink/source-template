'use client';

import { useState } from 'react';
import {
  Card,
  Container,
  Image,
  Col,
  Button,
} from 'react-bootstrap';
import { PlusLg } from 'react-bootstrap-icons';

type Player = {
  id: number;
  username: string;
  imageUrl?: string | null;
  game: string;
  rank: string;
};

type PlayerCardProps = {
  player: Player;
  onRequestClick: (player: Player) => void;
};

const PlayerCard = ({
  player,
  onRequestClick,
}: PlayerCardProps) => {
  const [imgSrc, setImgSrc] = useState(
    player.imageUrl ||
      '/default-player.svg',
  );

  return (
    <Card
      className="h-100 custom-card-body"
      style={{ width: '235px' }}
    >
      <Container className="ms-2">
        <Card.Body className="p-3">
          <Card.Title>
            <Col className="py-3">
              {player.username}
            </Col>
          </Card.Title>

          <Image
            src={imgSrc}
            width={155}
            height={160}
            rounded
            alt={player.username}
            onError={() =>
              setImgSrc(
                '/default-player.svg',
              )
            }
            style={{
              objectFit: 'cover',
              borderRadius: '12px',
              border:
                '4px solid #b0e0e682',
            }}
            className="mb-3"
          />

          <div>
            Game: {player.game}
          </div>

          <div className="mb-3">
            Rank: {player.rank}
          </div>

          <div className="d-flex justify-content-center mt-2">
            <Button
  className="custom-tag-btn d-flex align-items-center justify-content-center gap-2 w-auto"
  size="sm"
  onClick={() => onRequestClick(player)}
  style={{
    minWidth: '0',
    width: '135px',
    height: '34px',
    padding: '0 10px',
    borderRadius: '10px',
    fontWeight: 600,
  }}
>
  <PlusLg size={14} />
  Connect
</Button>
          </div>
        </Card.Body>
      </Container>
    </Card>
  );
};

export default PlayerCard;
