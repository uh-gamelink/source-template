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
import Form from 'react-bootstrap/Form';
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
  games: string[];
  currentPage: number;
  totalPages: number;
  totalPlayers: number;
  startItem: number;
  endItem: number;
  search: string;
};

const genericRanks = [
  'Beginner',
  'Casual',
  'Intermediate',
  'Advanced',
  'Competitive',
];

const ranksByGame: Record<string, string[]> = {
  Valorant: [
    'Iron',
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Ascendant',
    'Immortal',
    'Radiant',
  ],

  'Apex Legends': [
    'Rookie',
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Master',
    'Predator',
  ],

  'League of Legends': [
    'Iron',
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Emerald',
    'Diamond',
    'Master',
    'Grandmaster',
    'Challenger',
  ],

  'Counter-Strike 2': [
    'Silver',
    'Gold Nova',
    'Master Guardian',
    'Legendary Eagle',
    'Global Elite',
  ],

  'Overwatch 2': [
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Master',
    'Grandmaster',
    'Champion',
  ],

  Fortnite: [
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Elite',
    'Champion',
    'Unreal',
  ],

  'Rocket League': [
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Champion',
    'Grand Champion',
    'Supersonic Legend',
  ],

  Minecraft: [
    'Casual',
    'Builder',
    'Redstone',
    'PvP',
    'Survival',
  ],

  'Stardew Valley': [
    'Beginner',
    'Farmer',
    'Experienced',
    'Completionist',
  ],

  'Rainbow Six Siege': [
    'Copper',
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Emerald',
    'Diamond',
    'Champion',
  ],

  'Call of Duty: Warzone': [
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Crimson',
    'Iridescent',
    'Top 250',
  ],

  'Dota 2': [
    'Herald',
    'Guardian',
    'Crusader',
    'Archon',
    'Legend',
    'Ancient',
    'Divine',
    'Immortal',
  ],

  'Halo Infinite': [
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Onyx',
  ],

  'PUBG: Battlegrounds': [
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Crown',
    'Ace',
    'Conqueror',
  ],

  SMITE: [
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Master',
    'Grandmaster',
  ],

  'World of Warcraft': [
    'Casual',
    'Dungeon Finder',
    'Normal Raider',
    'Heroic Raider',
    'Mythic Raider',
    'PvP Rated',
  ],

  'Genshin Impact': [
    'Adventure Rank 20',
    'Adventure Rank 35',
    'Adventure Rank 45',
    'Adventure Rank 50',
    'Adventure Rank 55',
    'Adventure Rank 60',
  ],

  'Sea of Thieves': [
    'New Sailor',
    'Gold Hoarder',
    'Pirate Legend',
    'Athena',
  ],

  'Monster Hunter': [
    'Hunter Rank 1',
    'Hunter Rank 20',
    'Hunter Rank 50',
    'Hunter Rank 100',
    'Master Rank',
  ],

  'Elden Ring': [
    'New Tarnished',
    'Casual',
    'Experienced',
    'PvP',
    'Boss Helper',
  ],

  // Template for more games:
  // 'Game Title From Database': [
  //   'Rank 1',
  //   'Rank 2',
  //   'Rank 3',
  // ],
};

const getRanksForGame = (game: string) =>
  ranksByGame[game] ?? genericRanks;

const FindPlayersBrowser = ({
  players,
  games,
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

  const [requestUsername, setRequestUsername] =
    useState('');

  const [requestRank, setRequestRank] =
    useState('');

  const [requestError, setRequestError] =
    useState('');

  const [showAddListingModal, setShowAddListingModal] =
    useState(false);

  const [listingUsername, setListingUsername] =
    useState('');

  const [listingGame, setListingGame] =
    useState('');

  const [listingRank, setListingRank] =
    useState('');

  const [listingError, setListingError] =
    useState('');

  const [isSubmittingListing, setIsSubmittingListing] =
    useState(false);

  const router = useRouter();

  const listingRankOptions = listingGame
    ? getRanksForGame(listingGame)
    : [];

  const requestRankOptions = selectedPlayer
    ? getRanksForGame(selectedPlayer.game)
    : [];

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchTerm.trim();

      const current = search.trim();

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

    return () => clearTimeout(timer);
  }, [
    searchTerm,
    search,
    router,
  ]);

  const handleOpenModal = (
    player: Player,
  ) => {
    setSelectedPlayer(player);
    setRequestUsername('');
    setRequestRank('');
    setRequestError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlayer(null);
    setRequestUsername('');
    setRequestRank('');
    setRequestError('');
  };

  const handleOpenAddListingModal = () => {
    setListingError('');
    setShowAddListingModal(true);
  };

  const handleCloseAddListingModal = () => {
    setShowAddListingModal(false);
    setListingUsername('');
    setListingGame('');
    setListingRank('');
    setListingError('');
    setIsSubmittingListing(false);
  };

  const handleRequest = async () => {
    if (!selectedPlayer) return;

    const trimmedUsername =
      requestUsername.trim();

    if (!trimmedUsername || !requestRank) {
      setRequestError(
        'Please enter your username and rank.',
      );
      return;
    }

    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        receiverPlayerId: selectedPlayer.id,
        requesterUsername: trimmedUsername,
        requesterRank: requestRank,
        notes: '',
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

  const handleAddListing = async () => {
    setListingError('');

    const trimmedUsername =
      listingUsername.trim();

    if (
      !trimmedUsername ||
      !listingGame ||
      !listingRank
    ) {
      setListingError(
        'Please enter a username, game, and rank.',
      );
      return;
    }

    try {
      setIsSubmittingListing(true);

      const res = await fetch('/api/players', {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
          username: trimmedUsername,
          game: listingGame,
          rank: listingRank,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setListingError(
          data?.error ||
            'Failed to add player listing.',
        );
        return;
      }

      handleCloseAddListingModal();
      router.refresh();
    } catch (error) {
      console.error(error);
      setListingError(
        'Something went wrong while adding the listing.',
      );
    } finally {
      setIsSubmittingListing(false);
    }
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

  const pageNumbers = Array.from(
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

          <Button
            className="custom-tag-btn"
            onClick={handleOpenAddListingModal}
          >
            Add Player Listing
          </Button>

          <div
            style={{
              position: 'relative',
            }}
          >
            <input
              type="text"
              placeholder="Search player..."
              className="custom-card-body find-player-search"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              style={{
                width: '220px',
                padding: '8px 32px 8px 8px',
                borderRadius: '8px',
                borderColor: 'var(--color-primary)',
                color: 'var(--color-text)',
              }}
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform:
                    'translateY(-50%)',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '18px',
                  cursor: 'pointer',
                  color: 'var(--color-primary)',
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
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.4rem',
            justifyItems: 'center',
          }}
        >
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onRequestClick={
                handleOpenModal
              }
            />
          ))}
        </div>
      )}

      <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
        <Button
          className="custom-reset-btn"
          disabled={currentPage === 1}
          onClick={() =>
            goToPage(currentPage - 1)
          }
        >
          Previous
        </Button>

        {pageNumbers.map((page) => (
          <Button
            key={page}
            variant={
              page === currentPage
                ? 'dark'
                : 'light'
            }
            onClick={() => goToPage(page)}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="secondary"
          className="custom-reset-btn"
          disabled={
            currentPage === totalPages
          }
          onClick={() =>
            goToPage(currentPage + 1)
          }
        >
          Next
        </Button>
      </div>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        contentClassName="custom-modal-card"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Send Request
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedPlayer && (
            <>
              <div className="text-center mb-3">
                <Image
                  src={
                    selectedPlayer.imageUrl ||
                    '/default-player.svg'
                  }
                  width={120}
                  height={120}
                  roundedCircle
                  className="mb-3"
                  alt={selectedPlayer.username}
                />

                <p className="mb-1">
                  Request to connect with{' '}
                  <strong>
                    {selectedPlayer.username}
                  </strong>
                </p>

                <p className="mb-3">
                  Game:{' '}
                  <strong>
                    {selectedPlayer.game}
                  </strong>
                </p>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>
                  Your username for this game
                </Form.Label>

                <Form.Control
                  type="text"
                  placeholder="Enter your in-game username"
                  value={requestUsername}
                  onChange={(e) =>
                    setRequestUsername(
                      e.target.value,
                    )
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Your rank
                </Form.Label>

                <Form.Select
                  value={requestRank}
                  onChange={(e) =>
                    setRequestRank(
                      e.target.value,
                    )
                  }
                >
                  <option value="">
                    Select your rank
                  </option>

                  {requestRankOptions.map((rank) => (
                    <option
                      key={rank}
                      value={rank}
                    >
                      {rank}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
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
            className="custom-reset-btn"
            variant="secondary"
            onClick={handleCloseModal}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showAddListingModal}
        onHide={handleCloseAddListingModal}
        centered
        contentClassName="custom-modal-card"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Add Player Listing
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {listingError && (
            <Alert variant="danger">
              {listingError}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>
              Username
            </Form.Label>

            <Form.Control
              type="text"
              placeholder="Enter your in-game username"
              value={listingUsername}
              onChange={(e) =>
                setListingUsername(
                  e.target.value,
                )
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Game
            </Form.Label>

            <Form.Select
              value={listingGame}
              onChange={(e) => {
                setListingGame(e.target.value);
                setListingRank('');
              }}
            >
              <option value="">
                Select a game
              </option>

              {games.map((game) => (
                <option
                  key={game}
                  value={game}
                >
                  {game}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Rank
            </Form.Label>

            <Form.Select
              value={listingRank}
              disabled={!listingGame}
              onChange={(e) =>
                setListingRank(
                  e.target.value,
                )
              }
            >
              <option value="">
                {listingGame
                  ? 'Select a rank'
                  : 'Select a game first'}
              </option>

              {listingRankOptions.map((rank) => (
                <option
                  key={rank}
                  value={rank}
                >
                  {rank}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="custom-reset-btn"
            variant="secondary"
            onClick={
              handleCloseAddListingModal
            }
          >
            Cancel
          </Button>

          <Button
            className="custom-tag-btn"
            disabled={isSubmittingListing}
            onClick={handleAddListing}
          >
            {isSubmittingListing
              ? 'Adding...'
              : 'Add Listing'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FindPlayersBrowser;