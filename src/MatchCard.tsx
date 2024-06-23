import { Flag } from "./Flag";
import { ApiMatch1 } from "./apiClient";

import "./MatchCard.css";

export const MatchCard = ({ match }: { match: ApiMatch1 }) => {
  return (
    <div className="match">
      <div className="flex">
        <Flag team={match.team1} />
        <div className="calendar-team-name">{match.team1.name}</div>
        <div>{match.score1}</div>
      </div>

      <div className="flex">
        <Flag team={match.team2} />
        <div className="calendar-team-name">{match.team2.name}</div>
        <div>{match.score2}</div>
      </div>
    </div>
  );
};
