import classNames from "classnames";
import { ApiTeam } from "../utils/apiClient";

import styles from "./Flag.module.css";

type FlagSize = "sm" | "lg";

export const Flag = ({ team: team, size }: { team: ApiTeam, size?: FlagSize }) => {
  return (
    <div
      className={classNames(styles["flag"], styles[`flag-${size}`])}
      style={{ backgroundImage: `url(https://flagpedia.net/data/flags/h80/${team.code?.toLowerCase()}.webp)`}}
    >
    </div>
  );
};
