'use client';

// import { register } from 'module';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import the router
import { Container, Row, Col, Form, Image, Card, Button } from 'react-bootstrap';
import { PersonCircle } from 'react-bootstrap-icons';

/** After the user clicks the "Sign Up" link in the Sign Up page, display this page. */
const CreateProfile = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter(); // Initialize the router
  // Create a local URL for the uploaded image to display as a preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    
    if (file) {
      // Create local URL for preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <main>
      <Container>
        <Row className="justify-content-center my-5">
          <Col xs={8} lg={8}>
            <h1 className="text-center mb-3">Create a Profile</h1>
            <Card>
              <Form method="post" onSubmit={handleSubmit}>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className='text-start'>Description</Form.Label>
                          {/*...register('description') to be added*/}                        
                          <Form.Control 
                            name="description" 
                            as="textarea" 
                            rows={3} 
                            placeholder="Share about yourself" 
                            className="text-wrap"
                            required
                          />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className='text-start'>Interests</Form.Label>
                        {/*...register('interests') to be added*/}
                          <Form.Control 
                          name="interests" 
                          as="textarea" 
                          rows={3} 
                          placeholder="Favorite pastimes" 
                          className="text-wrap"
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="d-flex flex-column justify-content-center align-items-center">
                        {/* Display placeholder icon when null, otherwise display preview profile image */}
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
                          
                          {/*...register('profilePicture') to be added*/}
                          <Form.Control 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            required />
                        </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer>
                  <Button type="submit" className="mx-auto d-block">
                    Create Profile
                  </Button>
                </Card.Footer>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
}

export default CreateProfile;
