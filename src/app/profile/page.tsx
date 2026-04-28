'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

type ProfileData = {
  email: string;
  profile: {
    username: string | null;
    description: string;
    interests: string;
    profilePicture: string | null;
  } | null;
  savedServers?: {
    server: {
      name: string;
    };
  }[];
};

type Game = {
  id: number;
  title: string;
  developer: string;
  platform?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  tags: string[];
};

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [library, setLibrary] = useState<Game[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, libraryRes] = await Promise.all([
          fetch('/api/profile/me'),
          fetch('/api/library'),
        ]);

        const profileData = await profileRes.json();
        const libraryData = await libraryRes.json();

        if (!profileRes.ok) {
          setError(profileData.error || 'Failed to load profile.');
          setLoading(false);
          return;
        }

        if (!libraryRes.ok) {
          setError(libraryData.error || 'Failed to load library.');
          setLoading(false);
          return;
        }

        setUser(profileData);
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
    ? user.profile.interests
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  const savedServers = user.savedServers || [];

  const username = user.profile?.username || user.email.split('@')[0];

  const avatarSeed = user.email || user.profile?.username || 'guest';

  const rawProfilePicture = user.profile?.profilePicture;

  const hasUploadedProfilePicture =
    rawProfilePicture &&
    rawProfilePicture !== 'null' &&
    rawProfilePicture !== 'undefined' &&
    !rawProfilePicture.startsWith('blob:') &&
    !rawProfilePicture.startsWith('/api/avatar') &&
    !rawProfilePicture.includes('dicebear') &&
    rawProfilePicture !== '/default-player.svg' &&
    rawProfilePicture !== '/default-profile.png';

  const profileImage = hasUploadedProfilePicture
    ? rawProfilePicture
    : `/api/avatar?seed=${encodeURIComponent(avatarSeed)}&style=pixel-v3`;

  return (
    <Container className="py-5">
      <Card
        className="custom-card-body"
        style={{ borderRadius: '15px', padding: '10px' }}
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
                border: '2px solid rgba(127, 153, 255, 0.85)',
                boxShadow: '0 0 8px rgba(127, 153, 255, 0.35)',
                backgroundColor: 'rgba(92, 148, 252, 0.12)',
              }}
            >
              <Image
                key={profileImage}
                src={profileImage}
                alt="Profile picture"
                width={84}
                height={84}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                unoptimized={
                        profileImage.startsWith('blob:') ||
                        profileImage.startsWith('/api/avatar') ||
                        profileImage.includes('public.blob.vercel-storage.com')
                }
              />
            </div>

            <h1 style={{ margin: 0 }}>Your Profile</h1>
          </div>

          <Row>
            <Col md={3}>
              <p>
                <strong>Username:</strong> {username}
              </p>

              <p>
                <strong>Description:</strong>
                <br />
                {user.profile?.description || 'No description added yet.'}
              </p>

              <Link href="/profile/edit">Edit Profile</Link>
            </Col>

            <Col md={3}>
              <h5>Communities</h5>

              {savedServers.length > 0 ? (
                savedServers.map((savedServer, index) => (
                  <div
                    key={`${savedServer.server.name}-${index}`}
                    style={{
                      padding: '8px 0',
                      borderBottom: '1px solid rgba(92, 148, 252, 0.45)',
                    }}
                  >
                    {savedServer.server.name}
                  </div>
                ))
              ) : (
                <div>No communities added yet.</div>
              )}
            </Col>

            <Col md={3}>
              <h5><Link href="/gamelibrary/favorites" className='custom-link'>Favorites</Link></h5>

              <div className="favorites-list">
                {/* Show first 5 favorites with a count of remaining if more than 5 */}
                {library.length > 0 ? (
                  <>
                    {library.slice(0, 5).map((game) => (
                      <div
                        key={game.id}
                        style={{
                          padding: '8px 0',
                          borderBottom: '1px solid rgba(92, 148, 252, 0.45)',
                        }}
                      >
                        {game.title}
                      </div>
                    ))}
                    
                    {library.length > 5 && (
                      <div 
                        style={{
                          padding: '6px 0',
                          borderBottom: '1px solid rgba(92, 148, 252, 0.45)',
                          fontStyle: 'italic',
                          fontSize: '0.9em',
                        }}
                      >
                        + {library.length - 5} more in favorites
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mt-2">No games added yet.</div>
                )}
              </div>
            </Col>

            <Col md={3}>
              <h5>Interests</h5>

              {interestsList.length > 0 ? (
                interestsList.map((interest, index) => (
                  <div
                    key={`${interest}-${index}`}
                    style={{
                      padding: '8px 0',
                      borderBottom: '1px solid rgba(92, 148, 252, 0.45)',
                    }}
                  >
                    {interest}
                  </div>
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