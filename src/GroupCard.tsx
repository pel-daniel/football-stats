import { CSSProperties } from "react";
import { TeamRow } from "./TeamRow"
import { Group } from "./apiClient"

import './GroupCard.css';

export const GroupCard = ({ group, index }: { group: Group, index: number }) => {
  return (
    <div>
      <h3 className="group-card-name" style={{ "--color-group": `var(--color-group-${index})` } as CSSProperties}>
        {group.name}
      </h3>

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
