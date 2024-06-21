import { useEffect, useState } from 'react'
import { getTournament, Tournament } from './apiClient';
import { GroupCard } from './GroupCard';
import './App.css'

export const App = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const tournament = await getTournament('euro', 2020);
      setTournament(tournament);
    };

    fetchData();
  }, []);

  return (
    <>
      <div>
        { tournament && (
          <div>
            <h1>{tournament.name}</h1>

            {tournament.groups.map(group => <GroupCard group={group} key={group.name} />)}
          </div>
        )}

        { !tournament && (
          <p>Loading</p>
        )}
      </div>
    </>
  )
}
