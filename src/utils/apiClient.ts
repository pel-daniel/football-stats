import { getMatchResult, getScores } from "./tournamentUtils";

const baseUrl = 'https://raw.githubusercontent.com/openfootball';

export interface ApiTeam {
  name: string;
  code: string;
}

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

interface ApiScore {
  ht?: [number, number];
  ft?: [number, number];
  et?: [number, number];
  p?: [number, number];
}

export interface ApiMatch extends ApiMatchBase {
  score1i?: number;
  score2i?: number;
  score1?: number;
  score2?: number;
  score1et?: number;
  score2et?: number;
  score1p?: number;
  score2p?: number;
  score?: ApiScore;
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

export type MatchResult = 'win' | 'lose' | 'draw' | 'pending';

interface TeamScore {
  points: number;
  for: number;
  against: number;
  difference: number;
}

export type TeamScores = Record<ApiTeam['code'], TeamScore>;

export interface Match extends ApiMatchBase {
  score: ApiScore;
}

export interface Team extends ApiTeam, TeamScore {
  matches: Match[];
  group: string;
}

export interface Group {
  name: string;
  teams: Team[];
}

export interface Winners {
  firstPlace?: ApiTeam;
  secondPlace?: ApiTeam;
  thirdPlace?: ApiTeam;
  fourthPlace?: ApiTeam;
}

export interface Tournament {
  name: string;
  groups: Group[];
  matches: Match[];
  winners: Winners;
}

const getScore = (match: ApiMatch): ApiScore => {
  const ht: [number, number] | undefined = match.score1i != null && match.score2i != null ? [match.score1i, match.score2i] : match.score?.ht;
  const ft: [number, number] | undefined = match.score1 != null && match.score2 != null ? [match.score1, match.score2] : match.score?.ft;
  const et: [number, number] | undefined = match.score1et != null && match.score2et != null ? [match.score1et, match.score2et] : match.score?.et;
  const p: [number, number] | undefined = match.score1p != null && match.score2p != null ? [match.score1p, match.score2p] : match.score?.p;

  return { ht, ft, et, p };
}

const convertApiMatchToMatch = (match: ApiMatch): Match => {
  return {
    ...match,
    score: getScore(match)
  };
}

const getWinners = (tournamentMatches: ApiTournamentMatches): Winners => {
  const final = tournamentMatches.rounds.find(round => round.name === "Final");
  const thirdPlaceMatch = tournamentMatches.rounds.find(round => round.name === "Match for third place");

  let firstPlace: ApiTeam | undefined;
  let secondPlace: ApiTeam | undefined;
  let thirdPlace: ApiTeam | undefined;
  let fourthPlace: ApiTeam | undefined;

  if (final) {
    const team1FinalResult = final.matches && getMatchResult(
      convertApiMatchToMatch(final.matches[0]),
      final.matches[0].team1
    );

    if (team1FinalResult === "win") {
      firstPlace = final.matches[0].team1;
      secondPlace = final.matches[0].team2;
    } else if (team1FinalResult === "lose") {
      firstPlace = final.matches[0].team2;
      secondPlace = final.matches[0].team1;
    }
  }

  if (thirdPlaceMatch) {
    const team1ThirdPlaceResult = thirdPlaceMatch.matches && getMatchResult(
      convertApiMatchToMatch(thirdPlaceMatch.matches[0]),
      thirdPlaceMatch.matches[0].team1
    );

    if (team1ThirdPlaceResult === "win") {
      thirdPlace = thirdPlaceMatch.matches[0].team1;
      fourthPlace = thirdPlaceMatch.matches[0].team2;
    } else if (team1ThirdPlaceResult === "lose") {
      thirdPlace = thirdPlaceMatch.matches[0].team2;
      fourthPlace = thirdPlaceMatch.matches[0].team1;
    }
  }

  return { firstPlace, secondPlace, thirdPlace, fourthPlace };
}

export const getTournament = async (tournamentName: string, year: number, repo: string): Promise<Tournament | null> => {
  const tournamentGroupsResponse = await fetch(`${baseUrl}/${repo}.json/master/${year}/${tournamentName}.groups.json`);
  const tournamentMatchesResponse = await fetch(`${baseUrl}/${repo}.json/master/${year}/${tournamentName}.json`);

  if (tournamentGroupsResponse.ok && tournamentMatchesResponse.ok) {
    const tournamentGroups: ApiTournamentGroups = await tournamentGroupsResponse.json();
    const tournamentMatches: ApiTournamentMatches = await tournamentMatchesResponse.json();
    const matches: Match[] = tournamentMatches.rounds.flatMap(round => round.matches).
      map(convertApiMatchToMatch);
    const scores = getScores(tournamentMatches);

    const tournament = {
      name: tournamentGroups.name,
      matches,
      winners: getWinners(tournamentMatches),
      groups: tournamentGroups.groups.map(apiGroup => (
        {
          name: apiGroup.name,
          teams: apiGroup.teams.map(apiTeam => (
            {
              name: apiTeam.name,
              code: apiTeam.code,
              ...scores[apiTeam.code],
              group: apiGroup.name,
              matches: matches.
                filter(match => match.team1.code === apiTeam.code || match.team2.code === apiTeam.code).
                map(convertApiMatchToMatch)
            }
          ))
        }
      )),
    };

    return tournament;
  }

  return null;
}
