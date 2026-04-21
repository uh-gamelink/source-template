'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';

type Game = {
  id: number;
  title: string;
  developer: string;
  platform?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  tags: string[];
}

type ProfileData = {
  email: string;
  profile: {
    description: string;
    interests: string;
    profilePicture: string | null;
  } | null;
};

export default function ProfilePage() {
  // States for user profile, loading status, error messages, and user's game library.
  const [user, setUser] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [library, setLibrary] = useState<Game[]>([]);

  // Fetches both the user's profile and library data.
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, libraryRes] = await Promise.all([
          fetch('/api/profile/me'),
          fetch('/api/library'),
        ]);

        const profileData = await profileRes.json();
        const libraryData = await libraryRes.json();

        // Checks if profile fetch was successful before setting state, otherwise sets error message.
        if (!profileRes.ok) {
          setError(profileData.error || 'Failed to load profile.');
          setLoading(false);
          return;
        }

        setUser(profileData);

        // Checks if library fetch was successful before setting state, otherwise sets error message.
        if (!libraryRes.ok) {
          setError(libraryData.error || 'Failed to load library.');
          setLoading(false);
          return;
        }

        setLibrary(libraryData);
      } catch (err) {
        console.error(err);
        setError('Something went wrong while loading your profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Container className="py-5">
        <Card>
          <Card.Body>Loading profile...</Card.Body>
        </Card>
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container className="py-5">
        <Card>
          <Card.Body>{error || 'Profile not found.'}</Card.Body>
        </Card>
      </Container>
    );
  }

  const interestsList = user.profile?.interests
    ? user.profile.interests.split(',').map((item) => item.trim()).filter(Boolean)
    : [];

  const profileImage =
    user.profile?.profilePicture && !user.profile.profilePicture.startsWith('blob:')
      ? user.profile.profilePicture
      : '';

  return (
    <Container className="py-5">
      <Card className="custom-card-body"
        style={{
          borderRadius: '15px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          padding: '10px',
        }}
      >
        <Card.Body>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '25px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid rgba(92, 148, 252, 0.79)',
              }}
            >
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt="profile"
                  width={80}
                  height={80}
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#e9ecef',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                  }}
                >
                  👤
                </div>
              )}
            </div>

            <h1 style={{ margin: 0, fontWeight: '600' }}>
              Your Profile
            </h1>
          </div>

          <Row>
            <Col md={4}>
              <p><strong>Username:</strong> {user.email}</p>

              <p>
                <strong>Description:</strong><br />
                {user.profile?.description || 'No description added yet.'}
              </p>

              <Link href="/profile/edit">Edit Profile</Link>
            </Col>

            <Col md={4}>
              <h5 style={{ marginBottom: '15px' }}>Library</h5>

              {/* Displays the user's favorite games library or a message if no games have been added yet. */}
              {library.length > 0 ? (
                library.map((game, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '8px 0',
                      borderBottom: '1px solid rgb(92, 148, 252)'
                    }}
                  >
                    {game.title}
                  </div>
                ))
              ) : (
                <div>No games added yet.</div>
              )}
            </Col>

            <Col md={4}>
              <h5 style={{ marginBottom: '15px' }}>Interests</h5>

              {interestsList.length > 0 ? (
                interestsList.map((interest, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '8px 0',
                      borderBottom: '1px solid rgba(92, 148, 252, 0.45)'
                    }}
                  >
                    {interest}
                  </div >
                ))
              ) : (
                <div>No interests added yet.</div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}