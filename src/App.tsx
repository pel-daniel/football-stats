import { Route, Routes } from 'react-router';
import { TournamentPage } from './pages/TournamentPage'
import { TournamentSelectPage } from './pages/TournamentSelectPage';

import './App.css'

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<TournamentSelectPage />} />
      <Route path="tournaments/:name/:year" element={<TournamentPage />} />
    </Routes>
  );
}
