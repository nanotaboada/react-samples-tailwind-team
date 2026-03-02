/**
 * PlayersPage.tsx  –  the main list view
 *
 * Concepts demonstrated:
 *  - useEffect to load data when the component mounts (and re-fetch after mutations)
 *  - useState for local UI state (search query, loading flag, error, dialog open)
 *  - Filtering entirely on the client side (the API has no search endpoint)
 *  - shadcn/ui Table, Badge, Button
 *  - React Router Link / useNavigate for navigation
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getPlayers, deletePlayer } from '@/api/players';
import type { Player } from '@/types/player';
import { fullName }    from '@/types/player';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge }   from '@/components/ui/badge';
import { Button }  from '@/components/ui/button';
import { Input }   from '@/components/ui/input';
import DeleteDialog from '@/components/DeleteDialog';

// ─────────────────────────────────────────────────────────────────────────────
// PlayersPage
// ─────────────────────────────────────────────────────────────────────────────

export default function PlayersPage() {
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────────────────────
  const [players, setPlayers]     = useState<Player[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error,   setError]       = useState('');
  const [search,  setSearch]      = useState('');

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState<Player | null>(null);
  const [deleteError,  setDeleteError]  = useState('');

  // ── Load players on mount ──────────────────────────────────────────────────
  useEffect(() => {
    // This function is defined and called immediately so we can use async/await.
    // useEffect's callback itself cannot be async (it must return a cleanup
    // function or nothing).
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getPlayers();
        setPlayers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load players.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []); // Empty dependency array → run once after initial render

  // ── Client-side search/filter ──────────────────────────────────────────────
  const query = search.toLowerCase().trim();
  const filtered = players.filter((p) => {
    if (!query) return true;
    return (
      fullName(p).toLowerCase().includes(query) ||
      p.position.toLowerCase().includes(query) ||
      p.team.toLowerCase().includes(query) ||
      p.league.toLowerCase().includes(query) ||
      String(p.squadNumber).includes(query)
    );
  });

  // ── Delete handler ─────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteError('');
    try {
      await deletePlayer(deleteTarget.id);
      // Remove the player from local state so the table updates instantly
      // without a full re-fetch.
      setPlayers((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Delete failed.');
      throw err; // Re-throw so DeleteDialog shows its own loading state correctly
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* ── Toolbar: search + new player ──────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <Input
          placeholder="🔍 Search by name, position, team or squad number…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button asChild>
          <Link to="/players/new">+ New Player</Link>
        </Button>
      </div>

      {/* ── Error / loading states ───────────────────────────────────────── */}
      {deleteError && (
        <div className="rounded-md bg-destructive/15 px-4 py-2 text-sm text-destructive">
          {deleteError}
        </div>
      )}

      {loading && (
        <p className="text-muted-foreground text-sm">Loading players…</p>
      )}

      {!loading && error && (
        <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* ── Players table ────────────────────────────────────────────────── */}
      {!loading && !error && (
        <>
          <p className="text-xs text-muted-foreground">
            {filtered.length} of {players.length} players
          </p>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Position</TableHead>
                  <TableHead className="hidden md:table-cell">Team</TableHead>
                  <TableHead className="hidden lg:table-cell">League</TableHead>
                  <TableHead className="text-center">S11</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No players match your search.
                    </TableCell>
                  </TableRow>
                )}

                {filtered.map((player) => (
                  <TableRow key={player.id} className="group">
                    {/* Squad number */}
                    <TableCell className="text-center font-mono font-semibold">
                      {player.squadNumber}
                    </TableCell>

                    {/* Full name – clicking the row navigates to the detail page */}
                    <TableCell>
                      <button
                        className="text-left font-medium hover:underline focus:underline focus:outline-none"
                        onClick={() => navigate(`/players/${player.id}`)}
                      >
                        {fullName(player)}
                      </button>
                    </TableCell>

                    {/* Position badge */}
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{player.abbrPosition}</Badge>
                    </TableCell>

                    {/* Team */}
                    <TableCell className="hidden md:table-cell text-sm">
                      {player.team}
                    </TableCell>

                    {/* League */}
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {player.league}
                    </TableCell>

                    {/* Starting XI indicator */}
                    <TableCell className="text-center">
                      {player.starting11
                        ? <Badge className="bg-green-600 hover:bg-green-700 text-white">Yes</Badge>
                        : <Badge variant="secondary">No</Badge>
                      }
                    </TableCell>

                    {/* Row actions */}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/players/${player.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/players/${player.id}/edit`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setDeleteError('');
                            setDeleteTarget(player);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* ── Delete confirmation dialog ───────────────────────────────────── */}
      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        playerName={deleteTarget ? fullName(deleteTarget) : ''}
        onConfirm={handleDelete}
      />
    </div>
  );
}
