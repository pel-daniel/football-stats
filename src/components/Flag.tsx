import classNames from "classnames";
import { ApiTeam } from "../utils/apiClient";
import { iso3ToIso2 } from "../utils/countryUtils";

import styles from "./Flag.module.css";

type FlagSize = "sm" | "lg";

export const Flag = ({ team, size }: { team: ApiTeam, size?: FlagSize }) => {
  const iso2 = iso3ToIso2[team.code]?.toLowerCase();

  return (
    <div
      className={classNames(styles["flag"], styles[`flag-${size}`])}
      style={{ backgroundImage: `url(https://flagpedia.net/data/flags/h80/${iso2}.webp)`}}
    >
    </div>
  );
};
