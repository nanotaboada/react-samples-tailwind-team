// ─────────────────────────────────────────────────────────────────────────────
// Player – the core domain model returned by the REST API
// ─────────────────────────────────────────────────────────────────────────────

export interface Player {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;   // ISO-8601, e.g. "1987-06-24T00:00:00.000Z"
  squadNumber: number;
  position: string;      // full name, e.g. "Right Winger"
  abbrPosition: string;  // abbreviation, e.g. "RW"
  team: string;
  league: string;
  starting11: boolean;
}

// PlayerInput is used for POST / PUT – everything except the server-generated id.
export type PlayerInput = Omit<Player, 'id'>;

// ─────────────────────────────────────────────────────────────────────────────
// Known football positions (keeping the values consistent with the API data)
// ─────────────────────────────────────────────────────────────────────────────

export const POSITIONS: { label: string; abbr: string }[] = [
  { label: 'Goalkeeper',        abbr: 'GK' },
  { label: 'Right-Back',        abbr: 'RB' },
  { label: 'Centre-Back',       abbr: 'CB' },
  { label: 'Left-Back',         abbr: 'LB' },
  { label: 'Right Winger',      abbr: 'RW' },
  { label: 'Left Winger',       abbr: 'LW' },
  { label: 'Central Midfield',  abbr: 'CM' },
  { label: 'Defensive Midfield',abbr: 'DM' },
  { label: 'Attacking Midfield',abbr: 'AM' },
  { label: 'Centre-Forward',    abbr: 'CF' },
  { label: 'Second Striker',    abbr: 'SS' },
];

// Helper – full name from player object
export function fullName(p: Player): string {
  return [p.firstName, p.middleName, p.lastName].filter(Boolean).join(' ');
}

// Helper – format an ISO date string to a readable locale date
export function formatDate(iso: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
