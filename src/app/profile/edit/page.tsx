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
  const [username, setUsername] = useState('');
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
            setUsername(data.profile.username || '');
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
        console.error(err);
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

    const alreadyExists = interests.some(
      (interest) => interest.toLowerCase() === trimmed.toLowerCase(),
    );

    if (alreadyExists) {
      setNewInterest('');
      return;
    }

    setInterests([...interests, trimmed]);
    setNewInterest('');
  };

  const handleRemoveInterest = (indexToRemove: number) => {
    setInterests(interests.filter((_, index) => index !== indexToRemove));
  };

  const handleInterestKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInterest();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      setError(
        'Username must be 3–20 characters, no spaces, only letters, numbers, or underscores.',
      );
      return;
    }

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          interests: interests.join(', '),
          profilePicture,
          username,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || 'Failed to save profile.');
        setIsSubmitting(false);
        return;
      }

      router.push('/profile');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center my-5">
        <Col md={8}>
          <h1 className="text-center mb-3">
            {isEdit ? 'Edit Profile' : 'Create Profile'}
          </h1>

          <Card className="custom-card-body">
            <Form onSubmit={handleSubmit}>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose username (no spaces)"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    as="textarea"
                    rows={3}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Interests</Form.Label>

                  <div className="d-flex gap-2 mb-3">
                    <Form.Control
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyDown={handleInterestKeyDown}
                      placeholder="Add interest"
                    />
                    <Button type="button" onClick={handleAddInterest}>
                      Add
                    </Button>
                  </div>

                  <div className="d-flex flex-wrap gap-2">
                    {interests.map((interest, idx) => (
                      <span
                        key={`${interest}-${idx}`}
                        className="px-3 py-2 rounded-pill d-inline-flex align-items-center"
                        style={{
                          backgroundColor: 'rgb(65, 132, 255)',
                          color: 'rgb(21, 9, 102)',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                        onClick={() => handleRemoveInterest(idx)}
                        title="Remove interest"
                      >
                        {interest}
                        <span
                          style={{
                            marginLeft: '8px',
                            fontWeight: 900,
                            lineHeight: 1,
                          }}
                        >
                          ×
                        </span>
                      </span>
                    ))}
                  </div>
                </Form.Group>

                <Form.Group className="mb-3 text-center">
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

                  <Form.Label className="mt-3 d-block">
                    Upload Profile Picture
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                  />
                </Form.Group>

                {error && <Alert variant="danger">{error}</Alert>}
              </Card.Body>

              <Card.Footer>
                <Button
                  type="submit"
                  className="custom-reg-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Profile'}
                </Button>
              </Card.Footer>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileForm;