'use client';

import { Container, Row, Col, Card } from 'react-bootstrap';
import Image from 'next/image';

export default function ProfilePage() {
  const user = {
    username: 'Player1',
    description: 'Sample description here.',
    profileImage: '',
    library: ['Game 1', 'Game 2', 'Game 3'],
    interests: ['Interest 1', 'Interest 2', 'Interest 3'],
  };

  return (
    <Container className="py-5">

      <Card
        style={{
          borderRadius: '15px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          padding: '10px',
        }}
      >
        <Card.Body>

          {/* HEADER */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '25px',
            }}
          >
            {/* Profile Picture */}
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #ccc',
              }}
            >
              {user.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt="profile"
                  width={80}
                  height={80}
                  style={{ objectFit: 'cover' }}
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

            {/* Title */}
            <h1 style={{ margin: 0, fontWeight: '600' }}>
              Your Profile
            </h1>
          </div>

          <Row>

            {/* LEFT */}
            <Col md={4}>
              <p><strong>Username:</strong> {user.username}</p>

              <p>
                <strong>Description:</strong><br />
                {user.description}
              </p>

              <a href="/profile/edit">Edit</a>
            </Col>

            {/* MIDDLE */}
            <Col md={4}>
              <h5 style={{ marginBottom: '15px' }}>Library</h5>

              {user.library.map((game, index) => (
                <div
                  key={index}
                  style={{
                    padding: '8px 0',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {game}
                </div>
              ))}
            </Col>

            {/* RIGHT */}
            <Col md={4}>
              <h5 style={{ marginBottom: '15px' }}>Interests</h5>

              {user.interests.map((interest, index) => (
                <div
                  key={index}
                  style={{
                    padding: '8px 0',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {interest}
                </div>
              ))}
            </Col>

          </Row>
        </Card.Body>
      </Card>

    </Container>
  );
}