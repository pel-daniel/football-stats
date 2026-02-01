import classNames from "classnames";
import { Team } from "../utils/apiClient"
import { Flag } from "./Flag";

import './TeamRow.css';
import { getScore } from "../utils/tournamentUtils";

export const TeamRow = ({ team }: { team: Team }) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const timezone = today.toLocaleDateString(undefined, {day:'2-digit', timeZoneName: 'short' }).substring(4);

  return (
    <div className="flex match-row">
      <Flag team={team} />
      <div className="team-name">{team.name}</div>
      <div className="team-points">{team.points}</div>

      <div className="match-result-row">
        { team.matches.map(match => {
          const date = new Date(`${match.date.replace(/-/g, "/")} ${timezone}`);
          const againstTeam = match.team1.code !== team.code ? match.team1 : match.team2;

          return (
            <div
              className={classNames(
                `match-result match-result-${getScore(match, team)}`,
                {
                  "match-result-today": today.toDateString() === date.toDateString(),
                  "match-result-tomorrow": tomorrow.toDateString() === date.toDateString()
                }
              )}
              key={againstTeam.code}
            >
              <Flag team={againstTeam} size="sm" key={againstTeam.code} />
            </div>
          );
        })}
      </div>
    </div>
  )
}
