/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Outlet, Route, Routes, BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from './lib/query-client';
import { PadThemeProvider } from './contexts/PadThemeContext';
import { PadsProvider } from './contexts/PadsContext';

import Library from './pages/Library';
import Playlist from './pages/Playlist';
import LiveMode from './pages/LiveMode';
import Pads from './pages/Pads';
import Settings from './pages/Settings';
import PadThemes from './pages/PadThemes';
import Account from './pages/Account';
import AppConfig from './pages/AppConfig';
import SongEditor from './pages/SongEditor';
import AppLayout from './components/setlist/AppLayout';

export default function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <PadThemeProvider>
        <PadsProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Library />} />
                <Route path="/culto" element={<Playlist />} />
                <Route path="/ao-vivo" element={<LiveMode />} />
                <Route path="/pads" element={<Pads />} />
                <Route path="/ajustes" element={<Settings />} />
              </Route>
              <Route path="/ajustes/temas" element={<PadThemes />} />
              <Route path="/ajustes/conta" element={<Account />} />
              <Route path="/ajustes/config" element={<AppConfig />} />
              <Route path="/editor" element={<SongEditor />} />
            </Routes>
          </BrowserRouter>
        </PadsProvider>
      </PadThemeProvider>
    </QueryClientProvider>
  );
}
