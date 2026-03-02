/**
 * PlayerCreatePage.tsx
 *
 * Wraps PlayerForm for the "new player" use-case.
 * On successful API call, redirects to the new player's detail page.
 */

import { useNavigate, Link } from 'react-router-dom';
import { createPlayer } from '@/api/players';
import type { PlayerInput } from '@/types/player';
import { Button }     from '@/components/ui/button';
import PlayerForm from '@/components/PlayerForm';

export default function PlayerCreatePage() {
  const navigate = useNavigate();

  async function handleSubmit(data: PlayerInput) {
    // createPlayer sends POST /players and returns the created player (with id).
    const created = await createPlayer(data);
    // Take the user straight to the new player's detail page.
    navigate(`/players/${created.id}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">← Back to list</Link>
        </Button>
        <h1 className="text-2xl font-bold">New Player</h1>
      </div>

      <PlayerForm
        onSubmit={handleSubmit}
        submitLabel="Create Player"
      />
    </div>
  );
}
