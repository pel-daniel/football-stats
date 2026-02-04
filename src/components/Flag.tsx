import { ApiTeam } from "../utils/apiClient";
import { iso3ToIso2 } from "../utils/countryUtils";

import "./Flag.css";

type FlagSize = "sm" | "lg";

export const Flag = ({ team, size }: { team: ApiTeam, size?: FlagSize }) => {
  const iso2 = iso3ToIso2[team.code]?.toLowerCase();

  return (
    <div
      className={`flag flag-${size}`}
      style={{ backgroundImage: `url(https://flagpedia.net/data/flags/h80/${iso2}.webp)`}}
    >
    </div>
  );
};
