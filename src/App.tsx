/**
 * App.tsx
 *
 * This is the application entry point for routing.
 *
 * React Router v6 uses a declarative <Routes> / <Route> model:
 *  - BrowserRouter  wraps the whole app and enables URL-based navigation.
 *  - Routes         is a container that renders the first matching Route.
 *  - Route          maps a URL pattern to a React component.
 *
 * The Layout component wraps every page so the nav bar is always visible.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout             from '@/components/Layout';
import PlayersPage        from '@/pages/PlayersPage';
import PlayerDetailPage   from '@/pages/PlayerDetailPage';
import PlayerCreatePage   from '@/pages/PlayerCreatePage';
import PlayerEditPage     from '@/pages/PlayerEditPage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* List */}
          <Route path="/"                       element={<PlayersPage />} />

          {/* Create – must come BEFORE /:id so "/new" is not treated as an id */}
          <Route path="/players/new"            element={<PlayerCreatePage />} />

          {/* Detail */}
          <Route path="/players/:id"            element={<PlayerDetailPage />} />

          {/* Edit */}
          <Route path="/players/:id/edit"       element={<PlayerEditPage />} />

          {/* 404 fallback */}
          <Route path="*" element={
            <p className="text-muted-foreground">
              404 – Page not found.
            </p>
          } />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
