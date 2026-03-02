/**
 * PlayerEditPage.tsx
 *
 * Loads an existing player (by :id from the URL) then renders a pre-filled
 * PlayerForm. On submit it sends PUT /players/:id and redirects back to the
 * detail page.
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

import { getPlayerById, updatePlayer } from '@/api/players';
import type { Player, PlayerInput }    from '@/types/player';

import { Button }     from '@/components/ui/button';
import PlayerForm from '@/components/PlayerForm';

export default function PlayerEditPage() {
  const { id }  = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [player,  setPlayer]  = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  // Load the existing player data so we can pre-fill the form
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getPlayerById(Number(id));
        setPlayer(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Player not found.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSubmit(data: PlayerInput) {
    await updatePlayer(Number(id), data);
    navigate(`/players/${id}`);
  }

  if (loading) {
    return <p className="text-muted-foreground text-sm">Loading player…</p>;
  }

  if (error || !player) {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">
          {error || 'Player not found.'}
        </div>
        <Button variant="outline" asChild>
          <Link to="/">← Back to list</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/players/${player.id}`}>← Back</Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Player</h1>
      </div>

      {/*
        Pass `initial` so PlayerForm pre-fills every field with the existing
        values. The form is otherwise identical to the create form.
      */}
      <PlayerForm
        initial={player}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
}
