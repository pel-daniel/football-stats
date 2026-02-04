import { CSSProperties } from "react";
import { Group } from "../utils/apiClient";
import { TeamRow } from "./TeamRow";

import styles from './GroupCard.module.css';

export const GroupCard = ({ group, index }: { group: Group, index: number }) => {
  return (
    <div style={{ "--color-group": `var(--color-group-${index})` } as CSSProperties}>
      <h3 className={styles["group-card-name"]}>
        {group.name}
      </h3>

      <div className={styles["group-card"]}>
        {
          group.
            teams.
            sort((team1, team2) =>
              team1.points !== team2.points ? team2.points - team1.points : team2.difference - team1.difference
            ).
            map(team => <TeamRow team={team} key={team.code} />)
        }
      </div>
    </div>
  )
}
