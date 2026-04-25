import { Button, Modal, Form, Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { type Game } from '@/components/gamelibrary/GameLibraryCard';

interface Props {
    show: boolean;
    onHide: () => void;
    onRemove: (gameId: number) => void;
}

function PopUpFavoritesClientForm({ show, onHide, onRemove }: Props) {
    const [favorites, setFavorites] = useState<Game[]>([]);
    const [loading, setLoading] = useState(false);
    const [removingId, setRemovingId] = useState<number | null>(null);

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
            const res = await fetch('/api/library', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gameId }),
            });

            if (res.ok) {
                // Remove from modal list
                setFavorites((prev) => prev.filter((g) => g.id !== gameId));
                onRemove(gameId);
            }
        } finally {
            setRemovingId(null);
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
      <Modal.Header closeButton className="edit-favorites-title" style={{backgroundColor: 'lightgray'}}>
        <Modal.Title id="contained-modal-title-vhcenter">
          Edit Favorites
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{backgroundColor: 'lightgray', overflowY: 'auto', maxHeight: '57.5vh'}}>
        {loading ? (
          <div className="d-flex justify-content-center py-4">
            <Spinner animation="border" />
          </div>
        ) : favorites.length === 0 ? (
          <p className="text-center text-muted py-3">No favorite games yet.</p>
        ) : (
            <Form>
            {favorites.map((game) => (
                <div
                    key={game.id}
                    className="d-flex align-items-center py-2 px-1"
                >
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{game.title}</div>
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

      <Modal.Footer style={{backgroundColor: 'lightgray'}}>
        {(loading === false) && (favorites.length > 0) ? (
          <Button variant="danger" className="me-auto" onClick={() => { 
            if (confirm('Are you sure you want to clear all favorites?')) { 
                {/* Slow but works */}
                favorites.forEach((game) => handleRemove(game.id)); 
                } 
            }}>
            Clear All Favorites
          </Button>
        ) : null}
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function PopUpFavoritesClient({ onRemove }: { onRemove: (gameId: number) => void }) {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Edit Favorites
      </Button>

      <PopUpFavoritesClientForm
        show={modalShow}
        onHide={() => setModalShow(false)}
        onRemove={onRemove}
      />
    </>
  );
}