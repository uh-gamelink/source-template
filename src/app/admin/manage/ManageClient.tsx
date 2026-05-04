'use client';

import { useState } from 'react';
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  Container,
  Stack,
  Table,
} from 'react-bootstrap';
import GameForm from './GameForm';
import ServerForm from './ServerForm';
import {
  deleteGameAction,
  deleteServerAction,
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

type ManageClientProps = {
  games: Game[];
  servers: CommunityServer[];
};

type ManageTab = 'games' | 'servers';
type FormMode = 'none' | 'add-game' | 'edit-game' | 'add-server' | 'edit-server';

export default function ManageClient({
  games,
  servers,
}: ManageClientProps) {
  const [activeTab, setActiveTab] = useState<ManageTab>('games');
  const [formMode, setFormMode] = useState<FormMode>('none');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedServer, setSelectedServer] = useState<CommunityServer | null>(null);

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

  const closeForm = () => {
    setFormMode('none');
    setSelectedGame(null);
    setSelectedServer(null);
  };

  const switchToGames = () => {
    setActiveTab('games');
    closeForm();
  };

  const switchToServers = () => {
    setActiveTab('servers');
    closeForm();
  };

  return (
    <Container className="py-4">
      <Stack
        direction="horizontal"
        className="justify-content-between align-items-center mb-4"
      >
        <div>
          <h1 className="mb-1">Admin Manage</h1>
          <p className="mb-0 text-muted">
            Add, edit, or remove games and community servers.
          </p>
        </div>

        <ButtonGroup>
          <Button
            type="button"
            variant={showGames ? 'primary' : 'outline-primary'}
            onClick={switchToGames}
          >
            Manage Games
          </Button>

          <Button
            type="button"
            variant={showServers ? 'primary' : 'outline-primary'}
            onClick={switchToServers}
          >
            Manage Servers
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
                          className="text-break"
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
    </Container>
  );
}
