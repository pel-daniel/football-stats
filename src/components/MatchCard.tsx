import { CSSProperties } from "react";
import { Flag } from "./Flag";
import { Match } from "../utils/apiClient";

import "./MatchCard.css";

export const MatchCard = ({ match, groupIndex }: { match: Match, groupIndex: number }) => {
  const [fullTimeScore1, fullTimeScore2] = match.score.ft || [undefined, undefined];
  const [extraTimeScore1, extraTimeScore2] = match.score.et || [undefined, undefined];
  const [penaltiesScore1, penaltiesScore2] = match.score.p || [undefined, undefined];
  const score1 = penaltiesScore1 || extraTimeScore1;
  const score2 = penaltiesScore2 || extraTimeScore2;

  return (
    <div className="match" style={{ "--color-group": `var(--color-group-${groupIndex})` } as CSSProperties}>
      <div className="flex">
        <Flag team={match.team1} />
        <div className="calendar-team-name">{match.team1.name}</div>
        <div>
          {fullTimeScore1}
          {score1 !== undefined && ` (${score1})`}
        </div>
      </div>

      <div className="flex">
        <Flag team={match.team2} />
        <div className="calendar-team-name">{match.team2.name}</div>
        <div>
          {fullTimeScore2}
          {score2 !== undefined && ` (${score2})`}
        </div>
      </div>
    </div>
  );
};
