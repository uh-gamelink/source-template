'use client';

import {
  useState,
  useEffect,
} from 'react';
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
  currentPage: number;
  totalPages: number;
  totalPlayers: number;
  startItem: number;
  endItem: number;
  search: string;
};

const FindPlayersBrowser = ({
  players,
  currentPage,
  totalPages,
  totalPlayers,
  startItem,
  endItem,
  search,
}: FindPlayersBrowserProps) => {
  const [searchTerm, setSearchTerm] =
    useState(search);

  const [selectedPlayer, setSelectedPlayer] =
    useState<Player | null>(null);

  const [showModal, setShowModal] =
    useState(false);

  const [requestError, setRequestError] =
    useState('');

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed =
        searchTerm.trim();

      const current =
        search.trim();

      if (trimmed === current) {
        return;
      }

      const query =
        trimmed === ''
          ? '/findplayers'
          : `/findplayers?search=${encodeURIComponent(
              trimmed,
            )}`;

      router.push(query);
    }, 400);

    return () =>
      clearTimeout(timer);
  }, [
    searchTerm,
    search,
    router,
  ]);

  const handleOpenModal = (
    player: Player,
  ) => {
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

    const res = await fetch(
      '/api/requests',
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
          game: selectedPlayer.game,
          rank: selectedPlayer.rank,
          notes: '',
          receiverUsername:
            selectedPlayer.username,
        }),
      },
    );

    const data =
      await res.json();

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

  const goToPage = (
    page: number,
  ) => {
    const query =
      search.trim() === ''
        ? `/findplayers?page=${page}`
        : `/findplayers?page=${page}&search=${encodeURIComponent(
            search,
          )}`;

    router.push(query);
  };

  const pageNumbers =
    Array.from(
      {
        length: totalPages,
      },
      (_, i) => i + 1,
    );

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

          <div
            style={{
              position:
                'relative',
            }}
          >
            <input
              type="text"
              placeholder="Search player..."
              value={
                searchTerm
              }
              onChange={(
                e,
              ) =>
                setSearchTerm(
                  e.target
                    .value,
                )
              }
              style={{
                width:
                  '220px',
                padding:
                  '8px 32px 8px 8px',
                borderRadius:
                  '8px',
                border:
                  '1px solid #ccc',
              }}
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() =>
                  setSearchTerm(
                    '',
                  )
                }
                style={{
                  position:
                    'absolute',
                  right:
                    '8px',
                  top: '50%',
                  transform:
                    'translateY(-50%)',
                  border:
                    'none',
                  background:
                    'transparent',
                  fontSize:
                    '18px',
                  cursor:
                    'pointer',
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-3">
        Showing {startItem}–
        {endItem} of{' '}
        {totalPlayers}{' '}
        players
      </div>

      {players.length === 0 ? (
        <div className="text-center mt-5">
          No players found.
        </div>
      ) : (
        <div
          style={{
            display:
              'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.4rem',
            justifyItems:
              'center',
          }}
        >
          {players.map(
            (
              player,
            ) => (
              <PlayerCard
                key={
                  player.id
                }
                player={
                  player
                }
                onRequestClick={
                  handleOpenModal
                }
              />
            ),
          )}
        </div>
      )}

      <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
        <Button
          variant="secondary"
          disabled={
            currentPage ===
            1
          }
          onClick={() =>
            goToPage(
              currentPage -
                1,
            )
          }
        >
          Previous
        </Button>

        {pageNumbers.map(
          (page) => (
            <Button
              key={page}
              variant={
                page ===
                currentPage
                  ? 'dark'
                  : 'light'
              }
              onClick={() =>
                goToPage(
                  page,
                )
              }
            >
              {page}
            </Button>
          ),
        )}

        <Button
          variant="secondary"
          disabled={
            currentPage ===
            totalPages
          }
          onClick={() =>
            goToPage(
              currentPage +
                1,
            )
          }
        >
          Next
        </Button>
      </div>

      <Modal
        show={
          showModal
        }
        onHide={
          handleCloseModal
        }
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
                  '/default-player.svg'
                }
                width={
                  120
                }
                height={
                  120
                }
                roundedCircle
                className="mb-3"
                alt={
                  selectedPlayer.username
                }
              />

              <p>
                Request
                connecting
                with{' '}
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
              {
                requestError
              }
            </Alert>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="custom-tag-btn"
            onClick={
              handleRequest
            }
          >
            Request
          </Button>

          <Button
            variant="secondary"
            onClick={
              handleCloseModal
            }
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FindPlayersBrowser;