import { ApiTeam } from "./apiClient";
import { iso3ToIso2 } from "./countryUtils";

import "./Flag.css";
import './TeamRow.css';

type FlagSize = "sm" | "lg";

export const Flag = ({ team, size }: { team: ApiTeam, size?: FlagSize }) => {
  const iso2 = iso3ToIso2[team.code as keyof typeof iso3ToIso2]?.toLowerCase();

  return (
    <div
      className={`flag flat-${size}`}
      style={{ backgroundImage: `url(https://flagpedia.net/data/flags/h80/${iso2}.webp)`}}
    >
    </div>
  );
};
