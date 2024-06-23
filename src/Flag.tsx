import { ApiTeam } from "./apiClient";
import { iso3ToIso2 } from "./countryUtils";

import "./Flag.css";
import './TeamRow.css';

export const Flag = ({ team }: { team: ApiTeam }) => {
  const iso2 = iso3ToIso2[team.code as keyof typeof iso3ToIso2]?.toLowerCase();

  return (
    <div
      className="flag"
      style={{ backgroundImage: `url(https://flagpedia.net/data/flags/h80/${iso2}.webp)`}}
    >
    </div>
  );
};
