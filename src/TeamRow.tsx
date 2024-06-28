import { Team } from "./apiClient"
import { Flag } from "./Flag";

import './TeamRow.css';
import { getScore } from "./tournamentUtils";

export const TeamRow = ({ team }: { team: Team }) => {
  return (
    <div className="flex match-row">
      <Flag team={team} />
      <div className="team-name">{team.name}</div>
      <div className="team-points">{team.points}</div>

      <div className="match-result-row">
        { team.matches.map(match => {
          const againstTeam = match.team1.code !== team.code ? match.team1 : match.team2;

          return (
            <div className={`match-result match-result-${getScore(match, team)}`}>
              <Flag team={againstTeam} size="sm" key={againstTeam.code} />
            </div>
          );
        })}

        {/* {team.matchResults.map((result, index) =>
          <div key={index} className={`match-result match-result-${result}`}></div>
        )} */}
      </div>
    </div>
  )
}
