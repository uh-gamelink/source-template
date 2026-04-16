'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { upload } from '@vercel/blob/client';
import {
  Container,
  Row,
  Col,
  Form,
  Image,
  Card,
  Button,
  Alert,
} from 'react-bootstrap';
import { PersonCircle } from 'react-bootstrap-icons';

const ProfileForm = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [description, setDescription] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [existingImage, setExistingImage] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile/me');

        if (res.ok) {
          const data = await res.json();

          if (data?.profile) {
            setIsEdit(true);
            setDescription(data.profile.description || '');
            setInterests(
              data.profile.interests
                ? data.profile.interests
                    .split(',')
                    .map((item: string) => item.trim())
                    .filter(Boolean)
                : [],
            );
            setExistingImage(data.profile.profilePicture || null);
            setPreview(data.profile.profilePicture || null);
          }
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }

    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreview(existingImage);
    }
  };

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleAddInterest = () => {
    const trimmed = newInterest.trim();

    if (!trimmed) return;
    if (interests.includes(trimmed)) {
      setNewInterest('');
      return;
    }

    setInterests([...interests, trimmed]);
    setNewInterest('');
  };

  const handleRemoveInterest = (indexToRemove: number) => {
    setInterests(interests.filter((_, index) => index !== indexToRemove));
  };

  const handleInterestKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInterest();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (interests.length === 0) {
      setError('Please add at least one interest.');
      return;
    }

    setIsSubmitting(true);

    try {
      let profilePicture = existingImage || '/default-profile.png';

      if (selectedFile) {
        const blob = await upload(selectedFile.name, selectedFile, {
          access: 'public',
          handleUploadUrl: '/api/avatar/upload',
        });

        profilePicture = blob.url;
      }

      const res = await fetch('/api/profile', {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          interests: interests.join(', '),
          profilePicture,
        }),
      });

      let data: { error?: string } | null = null;

      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        setError(data?.error || 'Failed to save profile.');
        setIsSubmitting(false);
        return;
      }

      router.push('/profile');
    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <Container>
        <Row className="justify-content-center my-5">
          <Col xs={12} md={10} lg={8}>
            <h1 className="text-center mb-3">
              {isEdit ? 'Edit Profile' : 'Create a Profile'}
            </h1>

            <Card className="custom-card-body">
              <Form onSubmit={handleSubmit}>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          as="textarea"
                          rows={3}
                          placeholder="Share about yourself"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Interests</Form.Label>

                        <div className="d-flex flex-wrap gap-2 mb-3">
                          {interests.map((interest, index) => (
                            <div
                              key={`${interest}-${index}`}
                              className="px-3 py-1 rounded-pill d-flex align-items-center"
                              style={{
                                backgroundColor: '#0d6efd',
                                color: 'white',
                              }}
                            >
                              <span>{interest}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveInterest(index)}
                                style={{
                                  marginLeft: '8px',
                                  border: 'none',
                                  background: 'transparent',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  cursor: 'pointer',
                                  lineHeight: 1,
                                }}
                                aria-label={`Remove ${interest}`}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="d-flex gap-2">
                          <Form.Control
                            value={newInterest}
                            onChange={(e) => setNewInterest(e.target.value)}
                            onKeyDown={handleInterestKeyDown}
                            type="text"
                            placeholder="Add an interest"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={handleAddInterest}
                          >
                            Add
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col
                      md={6}
                      className="d-flex flex-column justify-content-center align-items-center"
                    >
                      {preview ? (
                        <Image
                          src={preview}
                          roundedCircle
                          thumbnail
                          style={{
                            width: '150px',
                            height: '150px',
                            objectFit: 'cover',
                          }}
                          alt="Profile Preview"
                        />
                      ) : (
                        <PersonCircle size={150} />
                      )}

                      <Form.Group className="mt-3 text-center">
                        <Form.Label>Upload Profile Picture</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
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
                    className="mx-auto d-block custom-reg-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? isEdit
                        ? 'Saving...'
                        : 'Creating...'
                      : isEdit
                        ? 'Save Changes'
                        : 'Create Profile'}
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

export default ProfileForm;