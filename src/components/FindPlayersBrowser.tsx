'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Alert from 'react-bootstrap/Alert';
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
};

const FindPlayersBrowser = ({
  players,
}: FindPlayersBrowserProps) => {
  const [searchTerm, setSearchTerm] =
    useState('');

  const [selectedPlayer, setSelectedPlayer] =
    useState<Player | null>(null);

  const [showModal, setShowModal] =
    useState(false);

  const [requestError, setRequestError] =
    useState('');

  const router = useRouter();

  const filteredPlayers =
    searchTerm.trim() === ''
      ? players
      : players.filter((player) =>
          player.username
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase(),
            ),
        );

  const handleOpenModal = (player: Player) => {
    setSelectedPlayer(player);
    setRequestError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlayer(null);
    setRequestError('');
  };

  const handleRequest = async () => {
    if (!selectedPlayer) return;

    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        game: selectedPlayer.game,
        rank: selectedPlayer.rank,
        notes: '',
        receiverUsername:
          selectedPlayer.username,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setRequestError(
        data?.error ||
          'Failed to create request',
      );
      return;
    }

    handleCloseModal();
    router.push('/requests');
    router.refresh();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-3">
        <div>
          <h1 className="mb-1">
            Find Players
          </h1>

          <p className="mb-0">
            Click the plus icon to request
            other players.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Link href="/requests">
            <Button className="custom-tag-btn">
              View Requests
            </Button>
          </Link>

          <input
            type="text"
            placeholder="Search player..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            style={{
              width: '220px',
              padding: '8px',
              borderRadius: '8px',
              border:
                '1px solid #ccc',
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.4rem',
          justifyItems: 'center',
        }}
      >
        {filteredPlayers.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onRequestClick={handleOpenModal}
          />
        ))}
      </div>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Send Request
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
          {selectedPlayer && (
            <>
              <Image
                src={
                  selectedPlayer.imageUrl ||
                  '/default-player.png'
                }
                width={120}
                height={120}
                roundedCircle
                className="mb-3"
                alt={
                  selectedPlayer.username
                }
              />

              <p>
                Request connecting with{' '}
                <strong>
                  {
                    selectedPlayer.username
                  }
                </strong>
                ?
              </p>
            </>
          )}

          {requestError && (
            <Alert variant="danger">
              {requestError}
            </Alert>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="custom-tag-btn"
            onClick={handleRequest}
          >
            Request
          </Button>

          <Button
            variant="secondary"
            onClick={handleCloseModal}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FindPlayersBrowser;