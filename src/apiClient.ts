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

export interface TeamMatches extends ApiTeam {
  points: number;
  matches: ApiMatch1[];
}

interface ApiRound {
  name: string;
  rounds: TeamMatches[];
}

export interface ApiGroup {
  name: string;
  teams: TeamMatches[];
}

interface ApiMatchBase {
  date: string;
  time: string;
  team1: ApiTeam;
  team2: ApiTeam;
}

export interface ApiMatch1 extends ApiMatchBase {
  score1: number;
  score1i: number;
  score2: number;
  score2i: number;
}

type ApiMatch2 = ApiMatchBase & {
  ht: [number, number];
  ft: [number, number];
};

interface ApiRound {
  name: string;
  matches: ApiMatch1[];
}

export interface ApiTournamentMatches {
  name: string;
  rounds: ApiRound[];
}

interface ApiTournamentGroups {
  name: string;
  groups: ApiGroup[];
}

type MatchResult = 'win' | 'lose' | 'draw';

interface TeamScore {
  points: number;
  for: number;
  against: number;
  difference: number;
  matchResults: MatchResult[];
}

export type TeamScores = Record<ApiTeam['code'], TeamScore>;

export interface Team extends ApiTeam, TeamScore {
  matches: ApiMatch1[];
}

export interface Group {
  name: string;
  teams: Team[];
}

export interface Tournament {
  name: string;
  groups: Group[];
  matches: ApiMatch1[];
}

export const getTournament = async (tournamentName: string, year: number): Promise<Tournament | null> => {
  const tournamentGroupsResponse = await fetch(`${baseUrl}/${tournamentName}.json/master/${year}/${tournamentName}.groups.json`);
  const tournamentMatchesResponse = await fetch(`${baseUrl}/${tournamentName}.json/master/${year}/${tournamentName}.json`);

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
