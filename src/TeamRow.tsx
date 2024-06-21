import { TeamMatches } from "./apiClient"

export const TeamRow = ({ team }: { team: TeamMatches }) => {
  return (
    <div>{team.name}</div>
  )
}
