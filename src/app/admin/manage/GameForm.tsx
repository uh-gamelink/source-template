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
  createGameAction,
  updateGameAction,
} from './actions';

type Game = {
  id: number;
  title: string;
  developer: string;
  platform: string | null;
  description: string | null;
  imageUrl: string | null;
  tags: string[];
};

type GameFormProps = {
  show: boolean;
  mode: 'add' | 'edit';
  game: Game | null;
  onCancelAction: () => void;
  onSavedAction: () => void;
};

export default function GameForm({
  show,
  mode,
  game,
  onCancelAction,
  onSavedAction,
}: GameFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEdit = mode === 'edit';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      if (isEdit) {
        await updateGameAction(formData);
      } else {
        await createGameAction(formData);
      }

      router.refresh();
      onSavedAction();
    });
  };

  return (
    <Modal show={show} onHide={onCancelAction} centered size="lg">
      <Modal.Header closeButton className="json-modal-header">
        <Modal.Title>{isEdit ? 'Edit Game' : 'Add Game'}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {isEdit && game && (
            <input type="hidden" name="id" value={game.id} />
          )}

          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="game-title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  name="title"
                  defaultValue={game?.title ?? ''}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="game-developer">
                <Form.Label>Developer</Form.Label>
                <Form.Control
                  name="developer"
                  defaultValue={game?.developer ?? ''}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="game-platform">
                <Form.Label>Platform</Form.Label>
                <Form.Control
                  name="platform"
                  defaultValue={game?.platform ?? ''}
                  placeholder="PC, Xbox, PlayStation, Switch"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="game-image-url">
                <Form.Label>Image URL or public image path</Form.Label>
                <Form.Control
                  name="imageUrl"
                  defaultValue={game?.imageUrl ?? ''}
                  placeholder="/gameLibrary/minecraft.png or https://..."
                />
                <Form.Text className="json-modal-guiding-text ">
                  For local images, place the file in public/gameLibrary and use a path like /gameLibrary/minecraft.png.
                </Form.Text>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group controlId="game-tags">
                <Form.Label>Tags</Form.Label>
                <Form.Control
                  name="tags"
                  defaultValue={game?.tags.join(', ') ?? ''}
                  placeholder="FPS, Competitive, Casual"
                />
                <Form.Text className="json-modal-guiding-text ">
                  Separate tags with commas.
                </Form.Text>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group controlId="game-description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  defaultValue={game?.description ?? ''}
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
                  : 'Add Game'}
            </Button>
          </Stack>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
