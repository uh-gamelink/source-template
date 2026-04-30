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
  createServerAction,
  updateServerAction,
} from './actions';

type CommunityServer = {
  id: number;
  name: string;
  description: string;
  inviteUrl: string;
  tags: string[];
  imageUrl: string | null;
  featured: boolean;
};

type ServerFormProps = {
  show: boolean;
  mode: 'add' | 'edit';
  server: CommunityServer | null;
  onCancelAction: () => void;
  onSavedAction: () => void;
};

export default function ServerForm({
  show,
  mode,
  server,
  onCancelAction,
  onSavedAction,
}: ServerFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEdit = mode === 'edit';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      if (isEdit) {
        await updateServerAction(formData);
      } else {
        await createServerAction(formData);
      }

      router.refresh();
      onSavedAction();
    });
  };

  return (
    <Modal show={show} onHide={onCancelAction} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? 'Edit Server' : 'Add Server'}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {isEdit && server && (
            <input type="hidden" name="id" value={server.id} />
          )}

          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="server-name">
                <Form.Label>Server Name</Form.Label>
                <Form.Control
                  name="name"
                  defaultValue={server?.name ?? ''}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="server-invite-url">
                <Form.Label>Invite URL</Form.Label>
                <Form.Control
                  name="inviteUrl"
                  defaultValue={server?.inviteUrl ?? ''}
                  placeholder="https://discord.gg/..."
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="server-image-url">
                <Form.Label>Image URL or public image path</Form.Label>
                <Form.Control
                  name="imageUrl"
                  defaultValue={server?.imageUrl ?? ''}
                  placeholder="/servers/uh-minecraft.png or https://..."
                />
                <Form.Text className="text-muted">
                  For local images, place the file in public/servers and use a path like /servers/uh-minecraft.png.
                </Form.Text>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="server-tags">
                <Form.Label>Tags</Form.Label>
                <Form.Control
                  name="tags"
                  defaultValue={server?.tags.join(', ') ?? ''}
                  placeholder="Minecraft, Casual, UH"
                />
                <Form.Text className="text-muted">
                  Separate tags with commas.
                </Form.Text>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group controlId="server-description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  defaultValue={server?.description ?? ''}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Check
                type="checkbox"
                name="featured"
                label="Featured server"
                defaultChecked={server?.featured ?? false}
              />
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
                  : 'Add Server'}
            </Button>
          </Stack>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
