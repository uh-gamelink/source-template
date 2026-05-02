'use client';

import { useState } from 'react';
import {
  Card,
  Container,
  Image,
  Col,
  Button,
  Badge,
  Row,
} from 'react-bootstrap';
import { PlusLg } from 'react-bootstrap-icons';

type Player = {
  id: number;
  username: string;
  imageUrl?: string | null;
  game: string;
  rank: string;
  moderationStatus?: string;
};

type PlayerCardProps = {
  player: Player;
  onRequestClick: (player: Player) => void;
};

const PlayerCard = ({ player, onRequestClick }: PlayerCardProps) => {
  const [imgSrc, setImgSrc] = useState(player.imageUrl || '/default-player.svg');

  return (
    <Card className="h-100 custom-card-body" style={{ width: '235px' }}>
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
            onError={() => setImgSrc('/default-player.svg')}
            style={{
              objectFit: 'cover',
              borderRadius: '12px',
              border: '4px solid #25f036b4',
            }}
            className="mb-3"
          />

          <div>Game: {player.game}</div>

          <div className="mb-2">Rank: {player.rank}</div>

          <Row className="ps-0 py-2 align-items-center">
            <Col xs="auto">
              <Button
                className="custom-tag-btn d-flex align-items-center justify-content-center custom-link-button"
                size="sm"
                onClick={() => onRequestClick(player)}
                style={{
                  width: '32px',
                  height: '32px',
                  padding: 0,
                }}
              >
                <PlusLg size={16} />
              </Button>
            </Col>

            <Col className="pl-0">Connect</Col>
          </Row>
            {player.moderationStatus === 'FLAGGED' && (
            <div className="mb-2 pt-2">
              <Badge bg="warning" text="dark" className="flag-font">
                Conduct Warning
              </Badge>
            </div>
          )}
        </Card.Body>
      </Container>
    </Card>
  );
};

export default PlayerCard;
