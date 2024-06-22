import { TeamRow } from "./TeamRow"
import { Group } from "./apiClient"

import './GroupCard.css';

export const GroupCard = ({ group }: { group: Group }) => {
  return (
    <div>
      <h2>{group.name}</h2>

      <div className="group-card">
        {
          group.teams.
            sort((team1, team2) => team2.points - team1.points).
            map(team => <TeamRow team={team} key={team.name} />)
        }
      </div>
    </div>
  )
}
