import { Team } from "./apiClient"

export const TeamRow = ({ team }: { team: Team }) => {
  return (
    <div className="flex">
      <div>{team.name}</div>
      <div>{team.points}</div>
      <div className="flex">
        {team.matchResults.map((result, index) =>
          <div key={index}>{result}</div>
        )}
      </div>
    </div>
  )
}
