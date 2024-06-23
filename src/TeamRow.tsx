import { Team } from "./apiClient"
import { Flag } from "./Flag";

import './TeamRow.css';

export const TeamRow = ({ team }: { team: Team }) => {
  return (
    <div className="flex">
      <Flag team={team} />
      <div className="team-name">{team.name}</div>
      <div className="team-points">{team.points}</div>

      <div className="flex">
        {team.matchResults.map((result, index) =>
          <div key={index} className={`match-result match-result-${result}`}></div>
        )}
      </div>
    </div>
  )
}
