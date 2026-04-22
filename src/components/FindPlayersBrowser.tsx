'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Alert from 'react-bootstrap/Alert';
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
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [requestError, setRequestError] = useState('');

  const router = useRouter();

  const createPageLink = (page: number) => {
    const query = new URLSearchParams();

    if (game) query.set('game', game);
    if (rank) query.set('rank', rank);
    query.set('page', String(page));

    return `/findplayers?${query.toString()}`;
  };

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

    setRequestError('');

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: selectedPlayer.game,
          rank: selectedPlayer.rank,
          notes: '', // ✅ FIX: ALWAYS SEND NOTES
          receiverUsername: selectedPlayer.username,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setRequestError(data?.error || 'Failed to create request');
        return;
      }

      handleCloseModal();
      router.push('/requests');
      router.refresh();
    } catch (err) {
      console.error(err);
      setRequestError('Failed to create request');
    }
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
            <Button className="custom-tag-btn">View Requests</Button>
          </Link>

          <button
            type="button"
            className="filter-toggle-btn position-absolute ms-4"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Search size={20} />
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.4rem',
          justifyItems: 'center',
        }}
      >
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onRequestClick={handleOpenModal}
          />
        ))}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Send Request</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
          {selectedPlayer && (
            <>
              <Image
                src={selectedPlayer.imageUrl || '/default-player.png'}
                width={120}
                height={120}
                roundedCircle
                alt={selectedPlayer.username}
                className="mb-3"
              />
              <p>
                Do you want to request connecting with{' '}
                <strong>{selectedPlayer.username}</strong>?
              </p>
            </>
          )}

          {requestError && (
            <Alert variant="danger">{requestError}</Alert>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button className="custom-tag-btn" onClick={handleRequest}>
            Request
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FindPlayersBrowser;