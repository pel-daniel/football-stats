import classNames from "classnames";
import { Flag } from "./Flag";

import { Team } from "../utils/apiClient"
import { getMatchResult } from "../utils/tournamentUtils";

import styles from './TeamRow.module.css';

export const TeamRow = ({ team }: { team: Team }) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const timezone = today.toLocaleDateString(
    undefined, {day:'2-digit', timeZoneName: 'short' }
  ).substring(4);

  return (
    <div className={classNames("flex", styles["match-row"])}>
      <Flag team={team} />
      <div className={styles["team-name"]}>{team.name}</div>
      <div className={styles["team-points"]}>{team.points}</div>

      <div className={styles["match-result-row"]}>
        { team.matches.map((match, index) => {
          const date = new Date(`${match.date.replace(/-/g, "/")} ${timezone}`);
          const againstTeam = match.team1.code !== team.code ? match.team1 : match.team2;

          return (
            <div
              className={classNames(
                styles["match-result"],
                styles[`match-result-${getMatchResult(match, team)}`],
                {
                  [styles["match-result-today"]]: today.toDateString() === date.toDateString(),
                  [styles["match-result-tomorrow"]]: tomorrow.toDateString() === date.toDateString()
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
  )
}
