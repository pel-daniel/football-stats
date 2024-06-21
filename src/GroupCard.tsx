import { TeamRow } from "./TeamRow"
import { Group } from "./apiClient"

export const GroupCard = ({ group }: { group: Group }) => {
  return (
    <div>
      <h2>{group.name}</h2>

      {group.teams.map(team => <TeamRow team={team} key={team.name} />)}
    </div>
  )
}
