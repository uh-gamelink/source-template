export function useRemoveFromLibrary(onSuccess: (gameIds: number[]) => void) {

  const removeFromLibrary = async (gameIds: number[]) => {
    const res = await fetch('/api/library', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameIds }),
    });

    if (res.ok) {
      onSuccess(gameIds);
    }
  };

  // Convenience wrapper for single removes
  const removeSingle = (gameId: number) => removeFromLibrary([gameId]);

  return { removeFromLibrary, removeSingle };
}
