'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Form, Button, Alert } from 'react-bootstrap';


export default function AddServerPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [inviteUrl, setInviteUrl] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          inviteUrl,
          imageUrl,
          featured,
          tags: tags.split(',').map(tag => tag.trim()),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      router.push('/community');
    } catch {
      setError('Something went wrong');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Add Discord Server</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Server Name</Form.Label>
          <Form.Control value={name} onChange={(e) => setName(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control value={description} onChange={(e) => setDescription(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Invite URL</Form.Label>
          <Form.Control value={inviteUrl} onChange={(e) => setInviteUrl(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tags (comma separated)</Form.Label>
          <Form.Control value={tags} onChange={(e) => setTags(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image URL</Form.Label>
          <Form.Control value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Featured Community"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
        </Form.Group>

        <Button type="submit">Add Server</Button>
      </Form>
    </Container>
  );
}