'use client';

import { FormEvent, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Stack,
} from 'react-bootstrap';
import {
  createPlayerAction,
  updatePlayerAction,
} from './actions';

type Player = {
  id: number;
  username: string;
  imageUrl: string | null;
  game: string;
  rank: string;
  moderationStatus: 'CLEAN' | 'FLAGGED' | 'BANNED';
};

type PlayerFormProps = {
  show: boolean;
  mode: 'add' | 'edit';
  player?: Player;
  onCancelAction: () => void;
  onSavedAction: () => void;
};

export default function PlayersForm({
  show,
  mode,
  player,
  onCancelAction,
  onSavedAction,
}: PlayerFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEdit = mode === 'edit';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      if (isEdit) {
        await updatePlayerAction(formData);
      } else {
        await createPlayerAction(formData);
      }

      router.refresh();
      onSavedAction();
    });
  };

  return (
    <Modal show={show} onHide={onCancelAction} centered size="lg">
      <Modal.Header closeButton className="json-modal-header">
        <Modal.Title>{isEdit ? 'Edit Player' : 'Add Player'}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {isEdit && player && (
            <input type="hidden" name="id" value={player.id} />
          )}

          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="player-username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  name="username"
                  defaultValue={player?.username ?? ''}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="player-game">
                <Form.Label>Game</Form.Label>
                <Form.Control
                  name="game"
                  defaultValue={player?.game ?? ''}
                  placeholder="Minecraft, Valorant..."
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="player-rank">
                <Form.Label>Rank</Form.Label>
                <Form.Control
                  name="rank"
                  defaultValue={player?.rank ?? ''}
                  placeholder="Gold, Diamond..."
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="player-image-url">
                <Form.Label>Image URL or public image path</Form.Label>
                <Form.Control
                  name="imageUrl"
                  defaultValue={player?.imageUrl ?? ''}
                  placeholder="/players/avatar.png or https://..."
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Stack direction="horizontal" gap={2}>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={onCancelAction}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending
                ? 'Saving...'
                : isEdit
                  ? 'Save Changes'
                  : 'Add Player'}
            </Button>
          </Stack>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
