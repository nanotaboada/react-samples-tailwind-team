/**
 * Layout.tsx
 *
 * The outer shell of every page: a top navigation bar + a centered content
 * area. All pages are rendered inside the <main> slot.
 *
 * React Router's <Link> and <useLocation> are used so the active nav item
 * gets a visual highlight without any extra state.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHealth } from '@/api/players';
import { Badge } from '@/components/ui/badge';

// ─────────────────────────────────────────────────────────────────────────────
// Health badge – lives in the header so it's always visible
// ─────────────────────────────────────────────────────────────────────────────

function HealthBadge() {
  const [status, setStatus] = useState<'checking' | 'ok' | 'error'>('checking');

  useEffect(() => {
    getHealth()
      .then(() => setStatus('ok'))
      .catch(() => setStatus('error'));
  }, []);

  const map = {
    checking: { className: '',                                                    label: 'API: checking…' },
    ok:       { className: 'bg-green-600 hover:bg-green-700 text-white border-0', label: 'API: online ✓'  },
    error:    { className: 'bg-red-600 hover:bg-red-700 text-white border-0',     label: 'API: offline ✗' },
  };

  const { className, label } = map[status];
  return <Badge className={className}>{label}</Badge>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout component
// ─────────────────────────────────────────────────────────────────────────────

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Navigation bar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <span>🇦🇷</span>
            <span className="hidden sm:inline">National Football Team</span>
          </Link>

          {/* Health badge – far right */}
          <HealthBadge />
        </div>
      </header>

      {/* ── Page content ───────────────────────────────────────────────── */}
      <main className="mx-auto max-w-screen-xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}
