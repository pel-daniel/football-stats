import { getScores } from "./tournamentUtils";

const baseUrl = 'https://raw.githubusercontent.com/openfootball';

export interface ApiTeam {
  name: string;
  code: string;
}

// interface Match {
//   date: string;
//   time: string;
//   team1: ApiTeam;
//   team2: ApiTeam;
//   score: Record<ApiTeam['code'], number>;
// }

export interface ApiGroup {
  name: string;
  teams: ApiTeam[];
}

interface ApiMatchBase {
  date: string;
  time: string;
  team1: ApiTeam;
  team2: ApiTeam;
}

// export interface ApiMatch extends ApiMatchBase {
//   score1: number;
//   score1i: number;
//   score2: number;
//   score2i: number;
// }

interface ApiScore {
  ht?: [number, number];
  ft?: [number, number];
}

export interface ApiMatch extends ApiMatchBase {
  score: ApiScore;
}

interface ApiRound {
  name: string;
  matches: ApiMatch[];
}

export interface ApiTournamentMatches {
  name: string;
  rounds: ApiRound[];
}

interface ApiTournamentGroups {
  name: string;
  groups: ApiGroup[];
}

type MatchResult = 'win' | 'lose' | 'draw' | 'pending';

interface TeamScore {
  points: number;
  for: number;
  against: number;
  difference: number;
  matchResults: MatchResult[];
}

export type TeamScores = Record<ApiTeam['code'], TeamScore>;

export interface Team extends ApiTeam, TeamScore {
  matches: ApiMatch[];
}

export interface Group {
  name: string;
  teams: Team[];
}

export interface Tournament {
  name: string;
  groups: Group[];
  matches: ApiMatch[];
}

export const getTournament = async (tournamentName: string, year: number, repo: string): Promise<Tournament | null> => {
  const tournamentGroupsResponse = await fetch(`${baseUrl}/${repo}.json/master/${year}/${tournamentName}.groups.json`);
  const tournamentMatchesResponse = await fetch(`${baseUrl}/${repo}.json/master/${year}/${tournamentName}.json`);

  if(tournamentGroupsResponse.ok && tournamentMatchesResponse.ok) {
    const tournamentGroups: ApiTournamentGroups = await tournamentGroupsResponse.json();
    const tournamentMatches: ApiTournamentMatches = await tournamentMatchesResponse.json();
    const matches = tournamentMatches.rounds.flatMap(round => round.matches);
    const scores = getScores(tournamentMatches);

    const tournament = {
      name: tournamentGroups.name,
      matches,
      groups: tournamentGroups.groups.map(apiGroup => (
        {
          name: apiGroup.name,
          teams: apiGroup.teams.map(apiTeam => (
            {
              name: apiTeam.name,
              code: apiTeam.code,
              ...scores[apiTeam.code],
              matches: matches.filter(match => match.team1.code === apiTeam.code || match.team2.code === apiTeam.code)
                  // map(match => (
                  //   {
                  //     ...match,
                  //     score: {
                  //       [match.team1.code]: match.score1,
                  //       [match.team2.code]: match.score2,
                  //       // [match.team1.code]: match.score.ft[0],
                  //       // [match.team2.code]: match.score.ft[1],
                  //     }
                  //   }
                  // )),
            }
          ))
        }
      )),
    };

    return tournament;
  }

  return null;
}
