'use client';

import React, { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { upload } from '@vercel/blob/client';
import { useSession } from 'next-auth/react';
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Button,
  Alert,
} from 'react-bootstrap';
import Image from 'next/image';

export default function ProfileForm() {
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [existingImage, setExistingImage] = useState<string | null>(null);

  const router = useRouter();

  const { data: session } = useSession();

  {/* Admin should not be able to edit their profile using user's page. 
      Can create + edit in Manage Players insteaad.
  */}
  if (!session) {
    redirect('/');
  } else if (session?.user.role === "ADMIN") {
    redirect('/not-authorized')
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile/me');
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Failed to load profile.');
          return;
        }

        if (data?.profile) {
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

          const profilePicture = data.profile.profilePicture || null;

          setExistingImage(profilePicture);
          setPreview(profilePicture);
        }
      } catch (err) {
        console.error(err);
        setError('Something went wrong while loading your profile.');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

    useEffect(() => {
      return () => {
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      };
    }, [preview]);

  
  const avatarSeed = session?.user?.email || 'guest';

  const generatedAvatar =
    `/api/avatar?seed=${encodeURIComponent(avatarSeed)}&style=pixel-v3`;

  const previewImage = preview || (!isLoadingProfile ? generatedAvatar : '');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

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
      let profilePicture: string | null = existingImage || null;

      if (selectedFile) {
        const blob = await upload(selectedFile.name, selectedFile, {
          access: 'public',
          handleUploadUrl: '/api/avatar/upload',
        });

        profilePicture = blob.url;
      }

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          description,
          interests: interests.join(', '),
          profilePicture,
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
          <h1 className="text-center mb-3">Edit Profile</h1>

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
                    placeholder="Tell people a little about yourself"
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
                          backgroundColor: 'rgb(1, 179, 75)',
                          color: 'black',
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
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      width={150}
                      height={150}
                      className="rounded-circle img-thumbnail"
                      style={{
                        objectFit: 'cover',
                      }}
                      alt="Profile preview"
                      unoptimized={
                        previewImage.startsWith('blob:') ||
                        previewImage.startsWith('/api/avatar') ||
                        previewImage.includes('public.blob.vercel-storage.com')
                      }
                    />
                  ) : (
                    <div
                      className="rounded-circle img-thumbnail mx-auto"
                      style={{
                        width: 150,
                        height: 150,
                        backgroundColor: '#101c37',
                      }}
                    />
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

              <Card.Footer className="d-flex gap-2">
                <Button
                  type="submit"
                  className="custom-reg-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Profile'}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push('/profile')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </Card.Footer>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}