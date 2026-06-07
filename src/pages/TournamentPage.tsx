import classNames from 'classnames';
import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router';

import { getTournament, Tournament } from '../utils/apiClient';
import { CalendarView } from '../components/CalendarView';
import { GroupCard } from '../components/GroupCard';

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
              { ["groups", "calendar"].map(view => (
                <Link
                  to={{ search: `?view=${view}` }}
                  className={classNames('radio-button', { active: view == activeView }) }
                >
                  <img
                    src={`/icons/${view}.svg`}
                    alt={`${view} logo`}
                    className={styles['icon']}
                  />
                </Link>

              ))}
            </div>
          </div>

          <div>
            { activeView === "groups" && (
              <div className={styles['groups']}>
                {tournament.groups.map((group, index) =>
                  <GroupCard group={group} index={index + 1} key={group.name} />
                )}
              </div>
            )}

            { activeView === "calendar" && <CalendarView tournament={tournament} /> }

          </div>
        </div>
      )}

      { !tournament && (
        <p>Loading</p>
      )}
    </div>
  )
}
