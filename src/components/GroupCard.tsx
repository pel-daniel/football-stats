import { CSSProperties } from "react";
import { Group } from "../apiClient";
import { TeamRow } from "./TeamRow";

import './GroupCard.css';

export const GroupCard = ({ group, index }: { group: Group, index: number }) => {
  return (
    <div style={{ "--color-group": `var(--color-group-${index})` } as CSSProperties}>
      <h3 className="group-card-name">
        {group.name}
      </h3>

      <div className="group-card">
        {
          group.
            teams.
            sort((team1, team2) => team1.points !== team2.points ? team2.points - team1.points : team2.difference - team1.difference).
            map(team => <TeamRow team={team} key={team.code} />)
        }
      </div>
    </div>
  )
}
