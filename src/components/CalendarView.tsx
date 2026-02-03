import classNames from "classnames";

import { ApiMatch, Tournament } from "../utils/apiClient";
import { MatchCard } from "./MatchCard";
import { getGroupIndex } from "../utils/tournamentUtils";

import './CalendarView.css';

export const CalendarView = ({ tournament }: { tournament: Tournament }) => {
  const matchesByDate = tournament.matches.reduce<Record<string, ApiMatch[]>>((acc, match) => {
    const key = match.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(match);
    return acc;
  }, {});
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const today = new Date();
  const timezone = today.toLocaleDateString(undefined, {day:'2-digit', timeZoneName: 'short' }).substring(4);

  return (
    <div className="calendar-grid">
      {daysOfWeek.map((day, index) =>
        <div key={index} className="cell">{day}</div>
      )}

      {Object.entries(matchesByDate).map(([key, matches]) => {
        const date = new Date(`${key.replace(/-/g, "/")} ${timezone}`);

        return (
          <div
            className={classNames("cell", { "cell-today": today.toDateString() === date.toDateString() })}
            style={{ gridColumn: ((date.getDay()) % 7) + 1 }}
            key={key}
          >
            <div className="cell-day">{date.getDate()}</div>

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
