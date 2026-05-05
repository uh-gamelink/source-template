'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  ButtonGroup,
  Card,
  Container,
  Form,
  Modal,
  Stack,
  Table,
} from 'react-bootstrap';
import GameForm from './GameForm';
import ServerForm from './ServerForm';
import PlayersForm from './PlayersForm';
import {
  deleteGameAction,
  deleteServerAction,
  deletePlayerAction,
  banPlayerAction,
  unbanPlayerAction,
  flagPlayerAction,
} from '@/app/admin/manage/actions';

type Game = {
  id: number;
  title: string;
  developer: string;
  platform: string | null;
  description: string | null;
  imageUrl: string | null;
  tags: string[];
  _count: {
    userGames: number;
  };
};

type CommunityServer = {
  id: number;
  name: string;
  description: string;
  inviteUrl: string;
  tags: string[];
  imageUrl: string | null;
  featured: boolean;
  _count: {
    savedByUsers: number;
  };
};

type Player = {
  id: number;
  username: string;
  imageUrl: string | null;
  game: string;
  rank: string;
  moderationStatus: 'CLEAN' | 'FLAGGED' | 'BANNED';
};

type ManageClientProps = {
  games: Game[];
  servers: CommunityServer[];
  players: Player[];
};

type ManageTab = 'games' | 'servers' | 'players';
type FormMode =
  | 'none'
  | 'add-game'
  | 'edit-game'
  | 'add-server'
  | 'edit-server'
  | 'add-player'
  | 'edit-player'
  | 'delete-player';

type JsonTarget = 'games' | 'servers' | null;

export default function ManageClient({
  games,
  servers,
  players,
}: ManageClientProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ManageTab>('games');
  const [formMode, setFormMode] = useState<FormMode>('none');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedServer, setSelectedServer] = useState<CommunityServer | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const [jsonTarget, setJsonTarget] = useState<JsonTarget>(null);
  const [jsonText, setJsonText] = useState('');
  const [jsonMessage, setJsonMessage] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [isSavingJson, setIsSavingJson] = useState(false);

  const savedByColumnStyle = {
    width: '115px',
    minWidth: '115px',
    whiteSpace: 'nowrap' as const,
  };

  const actionsColumnStyle = {
    width: '200px',
    minWidth: '200px',
    whiteSpace: 'nowrap' as const,
  };

  const formatInviteUrl = (url: string) => url.replace(/^https?:\/\//, '');

  const showGames = activeTab === 'games';
  const showServers = activeTab === 'servers';
  const showPlayers = activeTab === 'players';

  const getGamesJson = () =>
    games.map((game) => ({
      title: game.title,
      developer: game.developer,
      platform: game.platform ?? '',
      tags: game.tags,
      description: game.description ?? '',
      imageUrl: game.imageUrl ?? '',
    }));

  const getServersJson = () =>
    servers.map((server) => ({
      name: server.name,
      description: server.description,
      inviteUrl: server.inviteUrl,
      tags: server.tags,
      imageUrl: server.imageUrl ?? '',
      featured: server.featured,
    }));

  const openJsonEditor = (target: Exclude<JsonTarget, null>) => {
    closeForm();
    setJsonTarget(target);
    setJsonMessage('');
    setJsonError('');

    if (target === 'games') {
      setJsonText(JSON.stringify(getGamesJson(), null, 2));
    } else {
      setJsonText(JSON.stringify(getServersJson(), null, 2));
    }
  };

  const closeJsonEditor = () => {
    setJsonTarget(null);
    setJsonText('');
    setJsonMessage('');
    setJsonError('');
    setIsSavingJson(false);
  };

  const closeForm = () => {
    setFormMode('none');
    setSelectedGame(null);
    setSelectedServer(null);
    setSelectedPlayer(null);
  };

  const switchToGames = () => {
    setActiveTab('games');
    closeForm();
  };

  const switchToServers = () => {
    setActiveTab('servers');
    closeForm();
  };

  const switchToPlayers = () => {
    setActiveTab('players');
    closeForm();
  };

  const handleSaveJson = async (event: React.FormEvent) => {
    event.preventDefault();

    setJsonMessage('');
    setJsonError('');
    setIsSavingJson(true);

    try {
      const parsedJson = JSON.parse(jsonText);

      if (!Array.isArray(parsedJson)) {
        setJsonError('The JSON must be an array.');
        return;
      }

      const response = await fetch('/api/admin/edit-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          games: jsonTarget === 'games' ? parsedJson : getGamesJson(),
          communityServers:
            jsonTarget === 'servers' ? parsedJson : getServersJson(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setJsonError(data.error ?? 'Failed to save JSON data.');
        return;
      }

      setJsonMessage(
        jsonTarget === 'games'
          ? `Saved ${data.gamesImported} games.`
          : `Saved ${data.communityServersImported} community servers.`,
      );

      router.refresh();
    } catch {
      setJsonError('Invalid JSON. Check your quotes, commas, and brackets.');
    } finally {
      setIsSavingJson(false);
    }
  };

  return (
    <Container className="py-4">
      <Stack
        direction="horizontal"
        className="justify-content-between align-items-center mb-4"
      >
        <div>
          <h1 className="mb-1">Admin Manage</h1>
          <p className="mb-0">
            Add, edit, or remove games, players, and community servers.
          </p>
        </div>

        <ButtonGroup>
          <Button
            variant={showGames ? 'primary' : 'outline-primary'}
            style={!showGames ? { backgroundColor: 'transparent' } : {}}
            onClick={switchToGames}
          >
            Manage Games
          </Button>

          <Button
            variant={showServers ? 'primary' : 'outline-primary'}
            style={!showServers ? { backgroundColor: 'transparent' } : {}}
            onClick={switchToServers}
          >
            Manage Servers
          </Button>

          <Button
            variant={showPlayers ? 'primary' : 'outline-primary'}
            style={!showPlayers ? { backgroundColor: 'transparent' } : {}}
            onClick={switchToPlayers}
          >
            Manage Players
          </Button>
        </ButtonGroup>
      </Stack>

      {showGames && (
        <>
          <Card className="custom-card-body mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Games</strong>
                <span className="text-muted ms-2">({games.length})</span>
              </div>

              <Stack direction="horizontal" gap={2}>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => openJsonEditor('games')}
                >
                  Edit Games JSON
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setSelectedGame(null);
                    setFormMode('add-game');
                  }}
                >
                  + Add Game
                </Button>
              </Stack>
            </Card.Header>

            <Card.Body>
              <Table responsive bordered hover className="align-middle">
                <thead>
                  <tr>
                    <th style={{ width: '70px' }}>ID</th>
                    <th>Title</th>
                    <th>Developer</th>
                    <th>Platform</th>
                    <th>Tags</th>
                    <th style={savedByColumnStyle}>Saved By</th>
                    <th style={actionsColumnStyle}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {games.map((game) => (
                    <tr key={game.id}>
                      <td>{game.id}</td>
                      <td>{game.title}</td>
                      <td>{game.developer}</td>
                      <td>{game.platform || '-'}</td>
                      <td>
                        {game.tags.length > 0 ? (
                          game.tags.map((tag) => (
                            <Badge key={tag} bg="secondary" className="me-1">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          '-'
                        )}
                      </td>

                      <td style={savedByColumnStyle}>
                        {game._count.userGames}
                      </td>

                      <td style={actionsColumnStyle}>
                        <Stack direction="horizontal" gap={2}>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline-primary"
                            onClick={() => {
                              setSelectedGame(game);
                              setFormMode('edit-game');
                            }}
                          >
                            Edit
                          </Button>

                          <form
                            action={deleteGameAction}
                            onSubmit={(event) => {
                              if (
                                !window.confirm(
                                  `Delete ${game.title}? This will remove it from user libraries too.`,
                                )
                              ) {
                                event.preventDefault();
                              }
                            }}
                          >
                            <input type="hidden" name="id" value={game.id} />

                            <Button
                              size="sm"
                              variant="outline-danger"
                              type="submit"
                            >
                              Delete
                            </Button>
                          </form>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {games.length === 0 && (
                <p className="text-muted mb-0">No games found.</p>
              )}
            </Card.Body>
          </Card>

          {(formMode === 'add-game' || formMode === 'edit-game') && (
            <GameForm
              show
              mode={formMode === 'add-game' ? 'add' : 'edit'}
              game={selectedGame}
              onCancelAction={closeForm}
              onSavedAction={closeForm}
            />
          )}
        </>
      )}

      {showServers && (
        <>
          <Card className="custom-card-body mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Community Servers</strong>
                <span className="text-muted ms-2">({servers.length})</span>
              </div>

              <Stack direction="horizontal" gap={2}>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => openJsonEditor('servers')}
                >
                  Edit Server JSON
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setSelectedServer(null);
                    setFormMode('add-server');
                  }}
                >
                  + Add Server
                </Button>
              </Stack>
            </Card.Header>

            <Card.Body>
              <Table responsive bordered hover className="align-middle">
                <thead>
                  <tr>
                    <th style={{ width: '70px' }}>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Invite URL</th>
                    <th>Tags</th>
                    <th>Featured</th>
                    <th style={savedByColumnStyle}>Saved By</th>
                    <th style={actionsColumnStyle}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {servers.map((server) => (
                    <tr key={server.id}>
                      <td>{server.id}</td>
                      <td>{server.name}</td>
                      <td>{server.description}</td>
                      <td style={{ maxWidth: '260px' }}>
                        <a
                          href={server.inviteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-break admin-manage-link"
                        >
                          {formatInviteUrl(server.inviteUrl)}
                        </a>
                      </td>

                      <td>
                        {server.tags.length > 0 ? (
                          server.tags.map((tag) => (
                            <Badge key={tag} bg="secondary" className="me-1">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          '-'
                        )}
                      </td>

                      <td>{server.featured ? 'Yes' : 'No'}</td>

                      <td style={savedByColumnStyle}>
                        {server._count.savedByUsers}
                      </td>

                      <td style={actionsColumnStyle}>
                        <Stack direction="horizontal" gap={2}>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline-primary"
                            onClick={() => {
                              setSelectedServer(server);
                              setFormMode('edit-server');
                            }}
                          >
                            Edit
                          </Button>

                          <form
                            action={deleteServerAction}
                            onSubmit={(event) => {
                              if (
                                !window.confirm(
                                  `Delete ${server.name}? This will remove it from saved communities too.`,
                                )
                              ) {
                                event.preventDefault();
                              }
                            }}
                          >
                            <input type="hidden" name="id" value={server.id} />

                            <Button
                              size="sm"
                              variant="outline-danger"
                              type="submit"
                            >
                              Delete
                            </Button>
                          </form>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {servers.length === 0 && (
                <p className="text-muted mb-0">No community servers found.</p>
              )}
            </Card.Body>
          </Card>

          {(formMode === 'add-server' || formMode === 'edit-server') && (
            <ServerForm
              show
              mode={formMode === 'add-server' ? 'add' : 'edit'}
              server={selectedServer}
              onCancelAction={closeForm}
              onSavedAction={closeForm}
            />
          )}
        </>
      )}

      {showPlayers && (
        <>
          <Card className="custom-card-body mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Players</strong>
                <span className="text-muted ms-2">({players.length})</span>
              </div>

              <ButtonGroup className="mx-2">
                <Button
                  type="button"
                  size="sm"
                  className="mx-3 border-0"
                  onClick={() => {
                    setSelectedPlayer(null);
                    setFormMode('delete-player');
                  }}
                >
                  - Delete Player
                </Button>

                <Button
                  type="button"
                  size="sm"
                  className="border-0"
                  onClick={() => {
                    setSelectedPlayer(null);
                    setFormMode('add-player');
                  }}
                >
                  + Add Player
                </Button>
              </ButtonGroup>
            </Card.Header>

            <Card.Body>
              <Table responsive bordered hover className="align-middle">
                <thead>
                  <tr>
                    <th style={{ width: '70px' }}>ID</th>
                    <th>Username</th>
                    <th>Game</th>
                    <th>Rank</th>
                    <th>Status</th>
                    <th style={actionsColumnStyle}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {players.map((player) => (
                    <tr key={player.id}>
                      <td>{player.id}</td>
                      <td>{player.username}</td>
                      <td>{player.game}</td>
                      <td>{player.rank}</td>
                      <td>
                        <Badge
                          bg={
                            player.moderationStatus === 'BANNED'
                              ? 'danger'
                              : player.moderationStatus === 'FLAGGED'
                                ? 'warning'
                                : 'success'
                          }
                        >
                          {player.moderationStatus}
                        </Badge>
                      </td>

                      <td style={actionsColumnStyle}>
                        <Stack
                          direction="horizontal"
                          gap={2}
                          className="justify-content-between"
                        >
                          <Button
                            type="button"
                            size="sm"
                            variant="outline-primary"
                            onClick={() => {
                              setSelectedPlayer(player);
                              setFormMode('edit-player');
                            }}
                          >
                            Edit
                          </Button>

                          {player.moderationStatus === 'CLEAN' && (
                            <form action={flagPlayerAction}>
                              <input type="hidden" name="id" value={player.id} />
                              <Button size="sm" variant="outline-info" type="submit">
                                Flag
                              </Button>
                            </form>
                          )}

                          {player.moderationStatus !== 'BANNED' ? (
                            <form action={banPlayerAction}>
                              <input type="hidden" name="id" value={player.id} />
                              <Button
                                size="sm"
                                variant="outline-warning"
                                type="submit"
                              >
                                Ban
                              </Button>
                            </form>
                          ) : (
                            <form action={unbanPlayerAction}>
                              <input type="hidden" name="id" value={player.id} />
                              <Button
                                size="sm"
                                variant="outline-success"
                                type="submit"
                              >
                                Unban
                              </Button>
                            </form>
                          )}

                          <form
                            action={deletePlayerAction}
                            onSubmit={(event) => {
                              if (!window.confirm(`Delete ${player.username}?`)) {
                                event.preventDefault();
                              }
                            }}
                          >
                            <input type="hidden" name="id" value={player.id} />
                            <Button size="sm" variant="outline-danger" type="submit">
                              Delete
                            </Button>
                          </form>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {players.length === 0 && (
                <p className="text-muted mb-0">No players found.</p>
              )}
            </Card.Body>
          </Card>

          {(formMode === 'add-player' || formMode === 'edit-player') && (
            <PlayersForm
              show
              mode={formMode === 'add-player' ? 'add' : 'edit'}
              player={selectedPlayer ?? undefined}
              onCancelAction={closeForm}
              onSavedAction={closeForm}
            />
          )}

          {formMode === 'delete-player' && (
            <Modal show onHide={closeForm} centered size="lg">
              <Modal.Header closeButton className="json-modal-header">
                <Modal.Title id="contained-modal-title-vhcenter">
                  Delete Player
                </Modal.Title>
              </Modal.Header>

              <Modal.Body
                style={{
                  overflowY: 'auto',
                  maxHeight: '55vh',
                  padding: '0.3rem 1rem',
                  minHeight: '185px',
                }}
              >
                <Table responsive bordered hover className="align-middle">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Game</th>
                      <th>Rank</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {players.map((player) => (
                      <tr key={player.id}>
                        <td>{player.id}</td>
                        <td>{player.username}</td>
                        <td>{player.game}</td>
                        <td>{player.rank}</td>
                        <td style={actionsColumnStyle}>
                          <form
                            action={deletePlayerAction}
                            onSubmit={(event) => {
                              if (
                                !window.confirm(
                                  `Delete ${player.username}? This cannot be undone.`,
                                )
                              ) {
                                event.preventDefault();
                              }
                            }}
                          >
                            <input type="hidden" name="id" value={player.id} />
                            <Button
                              size="sm"
                              variant="outline-danger"
                              type="submit"
                            >
                              Delete
                            </Button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {players.length === 0 && (
                  <p className="text-muted mb-0">No players found.</p>
                )}
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={closeForm}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </>
      )}

      <Modal show={jsonTarget !== null} onHide={closeJsonEditor} centered size="xl">
        <Modal.Header closeButton className="json-modal-header">
          <Modal.Title>
            {jsonTarget === 'games'
              ? 'Edit Games JSON'
              : 'Edit Community Servers JSON'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            Edit the JSON below, then save to add new records or update existing
            records in the database.
          </p>

          {jsonMessage && <Alert variant="success">{jsonMessage}</Alert>}
          {jsonError && <Alert variant="danger">{jsonError}</Alert>}

          <Form id="json-edit-form" onSubmit={handleSaveJson}>
            <Form.Group>
              <Form.Label>
                {jsonTarget === 'games' ? 'Games JSON' : 'Community Servers JSON'}
              </Form.Label>

              <Form.Control
                as="textarea"
                rows={22}
                value={jsonText}
                onChange={(event) => setJsonText(event.target.value)}
                spellCheck={false}
                style={{
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  fontSize: '0.9rem',
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeJsonEditor}>
            Cancel
          </Button>

          <Button type="submit" form="json-edit-form" disabled={isSavingJson}>
            {isSavingJson ? 'Saving...' : 'Save JSON'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}