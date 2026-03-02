/**
 * PlayerDetailPage.tsx  –  read-only detail view for a single player
 *
 * Concepts demonstrated:
 *  - useParams: reading the :id route parameter supplied by React Router
 *  - Loading a single resource when the component mounts
 *  - Conditional rendering: loading / error / data
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

import { getPlayerById, deletePlayer } from '@/api/players';
import type { Player } from '@/types/player';
import { fullName, formatDate } from '@/types/player';

import { Button } from '@/components/ui/button';
import { Badge }  from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import DeleteDialog  from '@/components/DeleteDialog';

// ─────────────────────────────────────────────────────────────────────────────
// Small presentational helper: a labelled info row
// ─────────────────────────────────────────────────────────────────────────────

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium">{value}</dd>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PlayerDetailPage
// ─────────────────────────────────────────────────────────────────────────────

export default function PlayerDetailPage() {
  // useParams reads the dynamic segment from the URL, e.g. /players/10 → { id: "10" }
  // Note: route params are always strings even if we typed them as numbers in the route.
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [player,  setPlayer]  = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [showDelete, setShowDelete] = useState(false);

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
  }, [id]); // Re-run if the :id segment in the URL changes

  async function handleDelete() {
    if (!player) return;
    await deletePlayer(player.id);
    navigate('/'); // Send the user back to the list after deletion
  }

  // ── Render ─────────────────────────────────────────────────────────────

  if (loading) {
    return <p className="text-muted-foreground text-sm">Loading…</p>;
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

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">← Back</Link>
          </Button>
          <h1 className="text-2xl font-bold">{fullName(player)}</h1>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/players/${player.id}/edit`}>Edit</Link>
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDelete(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* ── Detail card ──────────────────────────────────────────────────── */}
      <Card className="max-w-2xl">
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
          <div>
            <CardTitle className="text-xl">{fullName(player)}</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">{player.team} · {player.league}</p>
          </div>

          {/* Squad number badge */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
            {player.squadNumber}
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
            <Field label="First Name"   value={player.firstName} />
            <Field label="Middle Name"  value={player.middleName || '—'} />
            <Field label="Last Name"    value={player.lastName} />

            <Field label="Date of Birth" value={formatDate(player.dateOfBirth)} />
            <Field label="Squad Number"  value={`#${player.squadNumber}`} />

            <Field
              label="Position"
              value={
                <span className="flex items-center gap-2">
                  {player.position}
                  <Badge variant="outline" className="text-xs">{player.abbrPosition}</Badge>
                </span>
              }
            />

            <Field label="Team"   value={player.team} />
            <Field label="League" value={player.league} />

            <Field
              label="Starting XI"
              value={
                player.starting11
                  ? <Badge className="bg-green-600 hover:bg-green-700 text-white">Yes</Badge>
                  : <Badge variant="secondary">No</Badge>
              }
            />
          </dl>
        </CardContent>
      </Card>

      {/* ── Delete confirmation ───────────────────────────────────────────── */}
      <DeleteDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        playerName={fullName(player)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
