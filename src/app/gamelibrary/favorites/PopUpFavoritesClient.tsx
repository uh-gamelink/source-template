import { Button, Modal, Form, Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { type Game } from '@/components/gamelibrary/GameLibraryCard';
import { useRemoveFromLibrary } from './RemoveFromLibrary';

interface Props {
    show: boolean;
    onHide: () => void;
    onRemove: (gameId: number) => void;
    onRemoveAll: () => void;
}

function PopUpFavoritesClientForm({ show, onHide, onRemove, onRemoveAll }: Props) {
    const [favorites, setFavorites] = useState<Game[]>([]);
    const [loading, setLoading] = useState(false);
    const [removingId, setRemovingId] = useState<number | null>(null);
    const { removeFromLibrary, removeSingle } = useRemoveFromLibrary((gameIds) => {
        setFavorites((prev) => prev.filter((g) => !gameIds.includes(g.id)));
    });


    // Fetch favorites when the modal is shown
    useEffect(() => {
        if (!show) return;

        setLoading(true);
        fetch('/api/library')
            .then((res) => res.json())
            .then((data: Game[]) => {
                if (Array.isArray(data)) setFavorites(data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [show]);

    // Removes a game from the library and updates local + parent state
    async function handleRemove(gameId: number) {
      setRemovingId(gameId);
      try {
          await removeSingle(gameId);
          onRemove(gameId);
      } finally {
          setRemovingId(null);
      }
    }

    // Removes all games from the library with one click.
    async function handleClearAll() {
      if (!confirm('Are you sure you want to clear all favorites?')) return;

      const allIds = favorites.map((g) => g.id);
      setLoading(true);
      try {
          await removeFromLibrary(allIds);
          onRemoveAll();
      } finally {
          setLoading(false);
      }
    }

    return (
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vhcenter"
        centered
      >
        <Modal.Header closeButton className="edit-favorites-popup border-0">
          <Modal.Title id="contained-modal-title-vhcenter">
            Edit Favorites
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{overflowY: 'auto', maxHeight: '55vh', padding: '0.35rem 1rem', minHeight: '185px'}}
                    className='edit-favorites-popup'>
          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <Spinner animation="border" />
            </div>
          ) : favorites.length === 0 ? (
            <p className="text-center py-5"
               style={{ color: 'rgb(119, 166, 255) !important' }}>
              No favorite games yet.
            </p>
          ) : (
              <Form>
              {favorites.map((game) => (
                  <div
                      key={game.id}
                      className="d-flex align-items-center py-2 px-1 border-bottom border-primary"
                  >
                      <div style={{ flex: 1 }}>
                          <div>{game.title}</div>
                      </div>

                      <Button
                          variant="outline-danger"
                          size="sm"
                          disabled={removingId === game.id}
                          onClick={() => handleRemove(game.id)}
                      >
                          {removingId === game.id ? (
                          "Removing..."
                          ) : (
                          "Remove"
                          )}
                      </Button>
                  </div>
              ))}
              </Form>
          )}
        </Modal.Body>

        <Modal.Footer className="edit-favorites-popup border-0">
          {(loading === false) && (favorites.length > 0) ? (
            <Button variant="danger" className="me-auto" onClick={handleClearAll}>
              Clear All Favorites
            </Button>
          ) : null}
          <Button variant="secondary" onClick={onHide}>Close</Button>
        </Modal.Footer>
    </Modal>
  );
}

export default function PopUpFavoritesClient({ onRemove, onRemoveAll }: 
  { onRemove: (gameId: number) => void; 
    onRemoveAll: () => void 
  }) {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <Button variant="primary" className="edit-favorites-button" onClick={() => setModalShow(true)}>
        Edit Favorites
      </Button>

      <PopUpFavoritesClientForm
        show={modalShow}
        onHide={() => setModalShow(false)}
        onRemove={onRemove}
        onRemoveAll={onRemoveAll}
      />
    </>
  );
}