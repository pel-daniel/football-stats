import { Team } from "./apiClient"
import { iso3ToIso2 } from "./countryUtils";
import './TeamRow.css';

export const TeamRow = ({ team }: { team: Team }) => {
  const iso2 = iso3ToIso2[team.code as keyof typeof iso3ToIso2]?.toLowerCase();

  return (
    <div className="flex">
      <div
        className="flag"
        style={{ backgroundImage: `url(https://flagpedia.net/data/flags/h80/${iso2}.webp)`}}
      >
      </div>

      <div className="team-name">{team.name}</div>
      <div>{team.points}</div>
      <div className="flex">
        {team.matchResults.map((result, index) =>
          <div key={index}>{result}</div>
        )}
      </div>
    </div>
  )
}
