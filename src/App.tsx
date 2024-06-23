import { useEffect, useState } from 'react'
import { getTournament, Tournament } from './apiClient';
import { CalendarView } from './CalendarView';
import { GroupCard } from './GroupCard';

import './App.css'

export const App = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const query = new URLSearchParams(window.location.search);

  useEffect(() => {
    const fetchData = async () => {
      const tournamentName = query.get("tournament") || "euro";
      const year = parseInt(query.get('year') || new Date().getFullYear().toString());
      const repo = query.get("repo") || tournamentName;
      const tournament = await getTournament(tournamentName, year, repo);

      setTournament(tournament);
    };

    fetchData();
  }, []);

  return (
    <div>
      { tournament && (
        <div>
          <h1>{tournament.name}</h1>

          <div className="layout">
            <CalendarView tournament={tournament} />

            <div className="groups">
              {tournament.groups.map((group, index) =>
                <GroupCard group={group} index={index + 1} key={group.name} />
              )}
            </div>
          </div>
        </div>
      )}

      { !tournament && (
        <p>Loading</p>
      )}
    </div>
  )
}
