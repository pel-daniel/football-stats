import classNames from 'classnames';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router';

import { getTournament, Tournament } from '../utils/apiClient';
import { CalendarView } from '../components/CalendarView';
import { GroupCard } from '../components/GroupCard';

import styles from './TournamentPage.module.css';

export const TournamentPage = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const { name, year } = useParams();

  const query = new URLSearchParams(window.location.search);
  const compact = query.get("compact") == "true";

  useEffect(() => {
    const fetchData = async (name: string, year: number) => {
      const tournament = await getTournament(name, year, name);
      setTournament(tournament);
    };


    if (name != null && year != null) {
      fetchData(name, parseInt(year));
    }
  }, []);

  return (
    <div className={classNames({ compact: compact })}>
      { tournament && (
        <div>
          <div className="flex mb-12">
            <img
              src={`/tournamentLogos/${name}.webp`}
              alt={`${name} logo`}
              className={styles['logo']}
            />
            <h1>{tournament.name}</h1>
          </div>

          <div className={styles['layout']}>
            <CalendarView tournament={tournament} />

            <div className={styles['groups']}>
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
