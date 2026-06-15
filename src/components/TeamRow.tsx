import { useState } from "react";
import classNames from "classnames";
import { Flag } from "./Flag";

import { Team } from "../utils/apiClient"
import { getMatchResult } from "../utils/tournamentUtils";

import styles from './TeamRow.module.css';
import { MatchCard } from "./MatchCard";

export const TeamRow = ({ team }: { team: Team }) => {
  const [isOpen, setIsOpen] = useState(false);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  return (
    <div>
      <div className={classNames("flex", styles["match-row"], { [styles["open"]]: isOpen })}>
        <button className={styles["arrow"]} onClick={() => setIsOpen(!isOpen)}>
          ▶︎
        </button>

        <div className="flex">
          <Flag team={team} />

          <div className={styles["team-name"]}>{team.name}</div>
          <div className={styles["team-points"]}>{team.points}</div>

          <div className={styles["match-result-row"]}>
            { team.matches.map((match, index) => {
              const againstTeam = match.team1.code !== team.code ? match.team1 : match.team2;

              return (
                <div
                  className={classNames(
                    styles["match-result"],
                    styles[`match-result-${getMatchResult(match, team.code)}`],
                    {
                      [styles["match-result-today"]]: today.toDateString() === match.date.toDateString(),
                      [styles["match-result-tomorrow"]]: tomorrow.toDateString() === match.date.toDateString()
                    }
                  )}
                  key={`${againstTeam.code}-${index}`}
                >
                  <div className={styles["match-flag"]}>
                    <Flag team={againstTeam} size="sm" key={againstTeam.code} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={classNames(styles["match-details"], { [styles["match-details-collapsed"]]: !isOpen })}>
        { team.matches.map((match, index) =>
          <MatchCard match={match} groupIndex={0} direction="horizontal" key={index} />
        )}
      </div>
    </div>
  )
}
