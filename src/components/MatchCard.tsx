import { CSSProperties } from "react";
import { Flag } from "./Flag";
import { ApiMatch } from "../utils/apiClient";

import "./MatchCard.css";

export const MatchCard = ({ match, groupIndex }: { match: ApiMatch, groupIndex?: number }) => {
  const score1 = match.score1 ?? (match.score?.ft && match.score.ft[0]);
  const score2 = match.score2 ?? (match.score?.ft && match.score.ft[1]);

  return (
    <div className="match" style={{ "--color-group": `var(--color-group-${groupIndex})` } as CSSProperties}>
      <div className="flex">
        <Flag team={match.team1} />
        <div className="calendar-team-name">{match.team1.name}</div>
        <div>{score1}</div>
      </div>

      <div className="flex">
        <Flag team={match.team2} />
        <div className="calendar-team-name">{match.team2.name}</div>
        <div>{score2}</div>
      </div>
    </div>
  );
};
