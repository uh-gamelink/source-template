'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';

type ProfileData = {
  email: string;
  profile: {
    username: string | null; // ✅ FIX
    description: string;
    interests: string;
    profilePicture: string | null;
  } | null;
};

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile/me');
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Failed to load profile.');
          setLoading(false);
          return;
        }

        setUser(data);
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

  const profileImage =
    user.profile?.profilePicture &&
    !user.profile.profilePicture.startsWith('blob:')
      ? user.profile.profilePicture
      : '';

  return (
    <Container className="py-5">
      <Card className="custom-card-body" style={{ borderRadius: '15px', padding: '10px' }}>
        <Card.Body>

          {/* HEADER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px' }}>
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

            <h1 style={{ margin: 0 }}>Your Profile</h1>
          </div>

          <Row>
            {/* LEFT */}
            <Col md={4}>
              <p>
                <strong>Username:</strong>{' '}
                {user.profile?.username || user.email.split('@')[0]}
              </p>

              <p>
                <strong>Description:</strong><br />
                {user.profile?.description || 'No description added yet.'}
              </p>

              <Link href="/profile/edit">Edit Profile</Link>
            </Col>

            {/* LIBRARY */}
            <Col md={4}>
              <h5>Library</h5>
              <div>No games added yet.</div>
            </Col>

            {/* INTERESTS */}
            <Col md={4}>
              <h5>Interests</h5>

              {interestsList.length > 0 ? (
                interestsList.map((interest, index) => (
                  <div
                    key={index}
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