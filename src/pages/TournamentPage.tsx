import classNames from 'classnames';
import { useEffect, useState } from 'react'

import { getTournament, Tournament } from '../utils/apiClient';
import { CalendarView } from '../components/CalendarView';
import { GroupCard } from '../components/GroupCard';

import styles from './TournamentPage.module.css';

export const TournamentPage = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const query = new URLSearchParams(window.location.search);
  const tournamentName = query.get("tournament") || "euro";
  const year = parseInt(query.get('year') || new Date().getFullYear().toString());
  const repo = query.get("repo") || tournamentName;
  const compact = query.get("compact") == "true";

  useEffect(() => {
    const fetchData = async () => {
      const tournament = await getTournament(tournamentName, year, repo);
      setTournament(tournament);
    };

    fetchData();
  }, []);

  return (
    <div className={classNames({ compact: compact })}>
      { tournament && (
        <div>
          <div className="flex mb-12">
            <img
              src={`../tournamentLogos/${repo}.webp`}
              alt={`${tournamentName} logo`}
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
