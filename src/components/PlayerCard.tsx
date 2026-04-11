'use client';

import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';

type AddPlayerFormData = {
  username: string;
  imageUrl: string;
  game: string;
  rank: string;
};

const AddPlayerForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddPlayerFormData>({
    defaultValues: {
      username: '',
      imageUrl: '',
      game: '',
      rank: '',
    },
  });

  const onSubmit = async (data: AddPlayerFormData) => {
    console.log('PLAYER DATA:', data);

    // later you can replace this with your real database action
    // await addPlayer(data);

    swal('Success', 'Player has been added', 'success', {
      timer: 2000,
    });

    reset();
  };

  return (
    <Card>
      <Card.Header>Add Player</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              {...register('username', { required: 'Username is required' })}
              isInvalid={!!errors.username}
            />
            <Form.Control.Feedback type="invalid">
              {errors.username?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              {...register('imageUrl')}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Game</Form.Label>
            <Form.Control
              type="text"
              {...register('game', { required: 'Game is required' })}
              isInvalid={!!errors.game}
            />
            <Form.Control.Feedback type="invalid">
              {errors.game?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rank</Form.Label>
            <Form.Control
              type="text"
              {...register('rank', { required: 'Rank is required' })}
              isInvalid={!!errors.rank}
            />
            <Form.Control.Feedback type="invalid">
              {errors.rank?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Row className="pt-3">
            <Col>
              <Button type="submit" variant="primary">
                Submit
              </Button>
            </Col>
            <Col>
              <Button type="button" onClick={() => reset()} variant="warning">
                Reset
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddPlayerForm;