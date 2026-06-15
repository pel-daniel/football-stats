import { CSSProperties } from "react";
import classNames from "classnames";

import { Flag } from "./Flag";
import { Match } from "../utils/apiClient";

import styles from "./MatchCard.module.css";

type Direction = "horizontal" | "vertical";

export const MatchCard = (
  { match, groupIndex, direction }: { match: Match, groupIndex: number, direction: Direction }
) => {
  const [fullTimeScore1, fullTimeScore2] = match.score.ft || [undefined, undefined];
  const [extraTimeScore1, extraTimeScore2] = match.score.et || [undefined, undefined];
  const [penaltiesScore1, penaltiesScore2] = match.score.p || [undefined, undefined];
  const score1 = penaltiesScore1 || extraTimeScore1;
  const score2 = penaltiesScore2 || extraTimeScore2;

  return (
    <div
      style={{ "--color-group": `var(--color-group-${groupIndex})` } as CSSProperties}
    >
      <div>{match.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>

      <div className={classNames(styles["match"], styles[`match-${direction}`])} >
        <div className="flex">
          <Flag team={match.team1} />

          <div className={styles["team-name"]}>
            {match.team1.name}
          </div>

          <div>
            {fullTimeScore1}
            {score1 !== undefined && ` (${score1})`}
          </div>
        </div>

        <div className={styles["divider"]}>—</div>

        <div className={classNames("flex", styles["team2"])}>
          <Flag team={match.team2} />

          <div className={styles["team-name"]}>
            {match.team2.name}
          </div>

          <div>
            {fullTimeScore2}
            {score2 !== undefined && ` (${score2})`}
          </div>
        </div>
      </div>
    </div>
  );
};
