'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Form, Image, Card, Button, Alert } from 'react-bootstrap';
import { PersonCircle } from 'react-bootstrap-icons';

const CreateProfile = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const description = formData.get('description');
    const interests = formData.get('interests');

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          interests,
          profilePicture: preview,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save profile.');
        setIsSubmitting(false);
        return;
      }

      router.push('/');
    } catch (err) {
      console.error(err);
      setError('Something went wrong while saving your profile.');
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <Container>
        <Row className="justify-content-center my-5">
          <Col xs={12} md={10} lg={8}>
            <h1 className="text-center mb-3">Create a Profile</h1>

            <Card>
              <Form onSubmit={handleSubmit}>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          name="description"
                          as="textarea"
                          rows={3}
                          placeholder="Share about yourself"
                          defaultValue=""
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Interests</Form.Label>
                        <Form.Control
                          name="interests"
                          as="textarea"
                          rows={3}
                          placeholder="Favorite pastimes"
                          defaultValue=""
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="d-flex flex-column justify-content-center align-items-center">
                      {preview ? (
                        <Image
                          src={preview}
                          roundedCircle
                          thumbnail
                          style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                          alt="Profile Preview"
                        />
                      ) : (
                        <PersonCircle size={150} className="text-secondary" />
                      )}

                      <Form.Group controlId="formFile" className="mt-3 text-center">
                        <Form.Label>Upload Profile Picture</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {error && (
                    <Alert variant="danger" className="mt-3 mb-0">
                      {error}
                    </Alert>
                  )}
                </Card.Body>

                <Card.Footer>
                  <Button
                    type="submit"
                    className="mx-auto d-block"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Profile'}
                  </Button>
                </Card.Footer>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default CreateProfile;