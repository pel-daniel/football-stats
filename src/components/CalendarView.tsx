import classNames from "classnames";

import { Match, Tournament } from "../utils/apiClient";
import { MatchCard } from "./MatchCard";
import { getGroupIndex } from "../utils/tournamentUtils";

import styles from './CalendarView.module.css';

export const CalendarView = ({ tournament }: { tournament: Tournament }) => {
  const matchesByDate = tournament.matches.reduce<Record<string, Match[]>>((acc, match) => {
    const key = match.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(match);
    return acc;
  }, {});
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const today = new Date();
  const timezone = today.toLocaleDateString(undefined, {day:'2-digit', timeZoneName: 'short' }).substring(4);

  return (
    <div className={styles["calendar-grid"]}>
      {daysOfWeek.map((day, index) =>
        <div key={index} className={styles["cell"]}>
          {day}
        </div>
      )}

      {Object.entries(matchesByDate).map(([key, matches]) => {
        const date = new Date(`${key.replace(/-/g, "/")} ${timezone}`);

        return (
          <div
            className={classNames(
              styles["cell"],
              { [styles["cell-today"]]: today.toDateString() === date.toDateString() }
            )}
            style={{ gridColumn: ((date.getDay()) % 7) + 1 }}
            key={key}
          >
            <div className={styles["cell-day"]}>
              {date.getDate()}
            </div>

            <div className="flex-column">
              {matches.map((match, index) =>
                <MatchCard
                  match={match}
                  groupIndex={getGroupIndex(match.team1.code, tournament.groups)}
                  key={index}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
