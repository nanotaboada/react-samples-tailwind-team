/**
 * api/players.ts
 *
 * All communication with the backend API lives here.
 * Every function returns a Promise, which is idiomatic for async JS/TS.
 *
 * The API base URL is intentionally hard-coded for simplicity (no .env setup
 * needed). In a production project you would read it from an environment
 * variable: import.meta.env.VITE_API_URL
 */

import type { Player, PlayerInput } from '@/types/player';

// All requests go to /api/* on the same origin.
// Vite's dev server proxies them to http://localhost:9000 (see vite.config.ts).
// This avoids CORS issues in the browser entirely.
const BASE_URL = '/api';

// ─────────────────────────────────────────────────────────────────────────────
// Generic helper – throw a meaningful error when the server responds with
// a non-2xx status code, otherwise parse and return the JSON body.
// ─────────────────────────────────────────────────────────────────────────────

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // Try to read an error message from the body; fall back to status text.
    const body = await response.text().catch(() => response.statusText);
    throw new Error(`HTTP ${response.status}: ${body}`);
  }
  // Some endpoints (e.g. DELETE) return 204 No Content – handle gracefully.
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /players
// ─────────────────────────────────────────────────────────────────────────────

export async function getPlayers(): Promise<Player[]> {
  const res = await fetch(`${BASE_URL}/players`);
  return handleResponse<Player[]>(res);
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /players/:id
// ─────────────────────────────────────────────────────────────────────────────

export async function getPlayerById(id: number): Promise<Player> {
  const res = await fetch(`${BASE_URL}/players/${id}`);
  return handleResponse<Player>(res);
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /players/squadnumber/:squadNumber
// ─────────────────────────────────────────────────────────────────────────────

export async function getPlayerBySquadNumber(squadNumber: number): Promise<Player> {
  const res = await fetch(`${BASE_URL}/players/squadnumber/${squadNumber}`);
  return handleResponse<Player>(res);
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /players  – create a new player
// ─────────────────────────────────────────────────────────────────────────────

export async function createPlayer(data: PlayerInput): Promise<Player> {
  const res = await fetch(`${BASE_URL}/players`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Player>(res);
}

// ─────────────────────────────────────────────────────────────────────────────
// PUT /players/:id  – replace (or update) an existing player
// ─────────────────────────────────────────────────────────────────────────────

export async function updatePlayer(id: number, data: PlayerInput): Promise<Player> {
  const res = await fetch(`${BASE_URL}/players/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Player>(res);
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /players/:id
// ─────────────────────────────────────────────────────────────────────────────

export async function deletePlayer(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/players/${id}`, {
    method: 'DELETE',
  });
  return handleResponse<void>(res);
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /health  – liveness check
// ─────────────────────────────────────────────────────────────────────────────

export async function getHealth(): Promise<{ status: string }> {
  const res = await fetch(`${BASE_URL}/health`);
  return handleResponse<{ status: string }>(res);
}
