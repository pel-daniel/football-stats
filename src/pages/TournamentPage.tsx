import classNames from 'classnames';
import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router';

import { getTournament, Tournament } from '../utils/apiClient';
import { CalendarView } from '../components/CalendarView';
import { GroupView } from '../components/GroupView';
import { BracketView } from '../components/BracketView';

import styles from './TournamentPage.module.css';

type View = "groups" | "calendar";

export const TournamentPage = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const { name, year } = useParams();
  const [searchParams] = useSearchParams();

  const activeView = searchParams.get("view") || "groups" as View;

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
    <div>
      { tournament && (
        <div>
          <Link
            to="/"
            className="inline-flex"
          >
            <div className={styles["icon"]}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M18 10a.75.75 0 0 1-.75.75H4.66l2.1 1.95a.75.75 0 1 1-1.02 1.1l-3.5-3.25a.75.75 0 0 1 0-1.1l3.5-3.25a.75.75 0 1 1 1.02 1.1l-2.1 1.95h12.59A.75.75 0 0 1 18 10Z" clipRule="evenodd" />
              </svg>
            </div>

            <p>All tournaments</p>
          </Link>

          <div className="flex-space-between mb-12">
            <div className="flex">
              <img
                src={`/tournamentLogos/${name}.webp`}
                alt={`${name} logo`}
                className={styles['logo']}
              />
              <h2>{tournament.name}</h2>
            </div>

            <div className="flex radio-group">
              { ["groups", "calendar", "bracket"].map(view => (
                <Link
                  to={{ search: `?view=${view}` }}
                  className={classNames('radio-button', { active: view == activeView }) }
                  key={view}
                >
                  <img
                    src={`/icons/${view}.png`}
                    alt={`${view} logo`}
                    className={styles['icon']}
                  />
                </Link>

              ))}
            </div>
          </div>

          <div>
            { activeView === "groups" && <GroupView tournament={tournament} /> }
            { activeView === "calendar" && <CalendarView tournament={tournament} /> }
            { activeView === "bracket" && <BracketView tournament={tournament} /> }
          </div>
        </div>
      )}

      { !tournament && (
        <p>Loading</p>
      )}
    </div>
  )
}
