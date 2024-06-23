import { ApiMatch } from "./apiClient";
import { MatchCard } from "./MatchCard";

import './CalendarView.css';

export const CalendarView = ({ matches }: { matches: ApiMatch[] }) => {
  // @ts-ignore:next-line
  const matchesByDate: Record<string, ApiMatch[]> = Object.groupBy(matches, (match: ApiMatch) => match.date)
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="calendar">
      <div className="day-of-week">
        {daysOfWeek.map((day, index) => <div key={index}>{day}</div>)}
      </div>

      <div className="date-grid">
        {Object.entries(matchesByDate).map(([key, matches]) => {
          const date = new Date(key);

          return (
            <div className="date-cell" style={{ gridColumn: ((date.getDay() + 1) % 7) + 1 }} key={key}>
              <div className="date-cell-day">{date.getDate() + 1}</div>

              <div className="flex-column">
                {matches.map((match, index) =>
                  <MatchCard match={match} key={index} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
};
