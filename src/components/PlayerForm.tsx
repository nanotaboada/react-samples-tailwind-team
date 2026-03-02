/**
 * PlayerForm.tsx
 *
 * A controlled form used for both **creating** and **editing** a player.
 * The parent page decides what happens on submit (POST vs PUT), so this
 * component is kept "dumb" – it just renders fields and calls onSubmit.
 *
 * Key concepts illustrated here:
 *  - Controlled inputs: React owns the value via useState.
 *  - Derived state: selecting a position auto-fills abbrPosition.
 *  - Form validation: simple HTML `required` attributes + a tiny manual check.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button }   from '@/components/ui/button';
import { Input }    from '@/components/ui/input';
import { Label }    from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { POSITIONS } from '@/types/player';
import type { Player, PlayerInput } from '@/types/player';

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface PlayerFormProps {
  /** When editing, pass the existing player to pre-fill the form. */
  initial?: Player;
  /** Called with the form data when the user clicks Save. */
  onSubmit: (data: PlayerInput) => Promise<void>;
  /** Label shown on the submit button, e.g. "Create Player". */
  submitLabel: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Strip the time part from an ISO datetime string so <input type="date"> is happy. */
function isoToDate(iso: string): string {
  if (!iso) return '';
  return iso.slice(0, 10); // "1987-06-24T00:00:00.000Z" → "1987-06-24"
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function PlayerForm({ initial, onSubmit, submitLabel }: PlayerFormProps) {
  const navigate = useNavigate();

  // Each form field is its own piece of state.
  // In a larger app you might reach for react-hook-form, but plain useState
  // is the most transparent approach for learning.
  const [firstName,   setFirstName]   = useState(initial?.firstName   ?? '');
  const [middleName,  setMiddleName]  = useState(initial?.middleName  ?? '');
  const [lastName,    setLastName]    = useState(initial?.lastName     ?? '');
  const [dateOfBirth, setDateOfBirth] = useState(isoToDate(initial?.dateOfBirth ?? ''));
  const [squadNumber, setSquadNumber] = useState(String(initial?.squadNumber ?? ''));
  const [position,    setPosition]    = useState(initial?.position    ?? '');
  const [abbrPosition,setAbbrPosition]= useState(initial?.abbrPosition ?? '');
  const [team,        setTeam]        = useState(initial?.team        ?? '');
  const [league,      setLeague]      = useState(initial?.league      ?? '');
  const [starting11,  setStarting11]  = useState(initial?.starting11  ?? false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');

  // When the user selects a position, automatically populate the abbreviation.
  function handlePositionChange(value: string) {
    setPosition(value);
    const found = POSITIONS.find((p) => p.label === value);
    if (found) setAbbrPosition(found.abbr);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // Prevent the browser from doing a full-page reload.
    setError('');

    // Basic validation beyond HTML "required"
    if (!squadNumber || Number(squadNumber) < 1) {
      setError('Squad number must be a positive integer.');
      return;
    }

    const payload: PlayerInput = {
      firstName:   firstName.trim(),
      middleName:  middleName.trim(),
      lastName:    lastName.trim(),
      // Convert the local date string back to an ISO datetime the API expects.
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : '',
      squadNumber: Number(squadNumber),
      position,
      abbrPosition,
      team:        team.trim(),
      league:      league.trim(),
      starting11,
    };

    setLoading(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{submitLabel}</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Error banner */}
          {error && (
            <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* ── Name row ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="Lionel"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                placeholder="Andrés"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Messi"
              />
            </div>
          </div>

          {/* ── Date of birth + Squad number ───────────────────────── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="squadNumber">Squad Number *</Label>
              <Input
                id="squadNumber"
                type="number"
                min={1}
                max={99}
                value={squadNumber}
                onChange={(e) => setSquadNumber(e.target.value)}
                required
                placeholder="10"
              />
            </div>
          </div>

          {/* ── Position ────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="position">Position *</Label>
              {/*
                shadcn Select is a wrapper around Radix UI's Select primitive.
                It is NOT a native <select>, so it needs the value/onValueChange
                pattern instead of onChange.
              */}
              <Select value={position} onValueChange={handlePositionChange} required>
                <SelectTrigger id="position">
                  <SelectValue placeholder="Choose position…" />
                </SelectTrigger>
                <SelectContent>
                  {POSITIONS.map((p) => (
                    <SelectItem key={p.abbr} value={p.label}>
                      {p.label} ({p.abbr})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="abbrPosition">Abbreviation</Label>
              <Input
                id="abbrPosition"
                value={abbrPosition}
                onChange={(e) => setAbbrPosition(e.target.value)}
                placeholder="Auto-filled from position"
                maxLength={3}
              />
            </div>
          </div>

          {/* ── Team + League ────────────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="team">Team *</Label>
              <Input
                id="team"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                required
                placeholder="Inter Miami CF"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="league">League *</Label>
              <Input
                id="league"
                value={league}
                onChange={(e) => setLeague(e.target.value)}
                required
                placeholder="Major League Soccer"
              />
            </div>
          </div>

          {/* ── Starting 11 ─────────────────────────────────────────── */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="starting11"
              checked={starting11}
              onCheckedChange={(checked) => setStarting11(checked === true)}
            />
            <Label htmlFor="starting11" className="cursor-pointer">
              In the Starting XI
            </Label>
          </div>

          {/* ── Actions ─────────────────────────────────────────────── */}
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving…' : submitLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
