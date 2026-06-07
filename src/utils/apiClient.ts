import { countryToIso2 } from "./countryUtils";
import { getMatchResult, getScores } from "./tournamentUtils";

const baseUrl = 'https://raw.githubusercontent.com/openfootball';

export interface ApiTeam {
  name: string;
  code: string;
}

export interface ApiGroup {
  name: string;
  teams: string[] | ApiTeam[];
}

interface ApiMatchBase {
  date: string;
  time: string;
  team1: string;
  team2: string;
}

interface ApiScore {
  ht?: [number, number];
  ft?: [number, number];
  et?: [number, number];
  p?: [number, number];
}

export interface ApiMatch extends ApiMatchBase {
  round: string;
  group: string;
  ground: string;
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

export interface ApiTournamentMatches {
  name: string;
  matches: ApiMatch[];
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

export interface Match {
  date: string;
  time: string;
  team1: ApiTeam;
  team2: ApiTeam;
  score: ApiScore;
}

export interface Team extends TeamScore {
  name: string;
  code: string;
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
    team1: { name: match.team1, code: countryToIso2[match.team1] },
    team2: { name: match.team2, code: countryToIso2[match.team2] },
    score: getScore(match)
  };
}

const getWinners = (tournamentMatches: ApiTournamentMatches): Winners => {
  const final = tournamentMatches.matches.find(match => match.round === "Final");
  const thirdPlaceMatch = tournamentMatches.matches.find(match => match.round === "Match for third place");

  let firstPlace: ApiTeam | undefined;
  let secondPlace: ApiTeam | undefined;
  let thirdPlace: ApiTeam | undefined;
  let fourthPlace: ApiTeam | undefined;

  if (final) {
    const team1FinalResult = final && getMatchResult(
      convertApiMatchToMatch(final),
      final.team1,
    );

    if (team1FinalResult === "win") {
      firstPlace = { name: final.team1, code: countryToIso2[final.team1] };
      secondPlace = { name: final.team2, code: countryToIso2[final.team2] };
    } else if (team1FinalResult === "lose") {
      firstPlace = { name: final.team2, code: countryToIso2[final.team2] };
      secondPlace = { name: final.team1, code: countryToIso2[final.team1] };
    }
  }

  if (thirdPlaceMatch) {
    const team1ThirdPlaceResult = thirdPlaceMatch && getMatchResult(
      convertApiMatchToMatch(thirdPlaceMatch),
      thirdPlaceMatch.team1
    );

    if (team1ThirdPlaceResult === "win") {
      thirdPlace = { name: thirdPlaceMatch.team1, code: countryToIso2[thirdPlaceMatch.team1] };
      fourthPlace = { name: thirdPlaceMatch.team2, code: countryToIso2[thirdPlaceMatch.team2] };
    } else if (team1ThirdPlaceResult === "lose") {
      thirdPlace = { name: thirdPlaceMatch.team2, code: countryToIso2[thirdPlaceMatch.team2] };
      fourthPlace = { name: thirdPlaceMatch.team1, code: countryToIso2[thirdPlaceMatch.team1] };
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
    const matches: Match[] = tournamentMatches.matches.map(convertApiMatchToMatch);
    const scores = getScores(tournamentMatches);

    const tournament = {
      name: tournamentGroups.name,
      matches,
      winners: getWinners(tournamentMatches),
      groups: tournamentGroups.groups.map(apiGroup => (
        {
          name: apiGroup.name,
          teams: apiGroup.teams.map(apiTeam => {
            const teamName = typeof apiTeam === "string" ? apiTeam : apiTeam.name;

            return {
              name: teamName,
              code: countryToIso2[teamName],
              ...scores[teamName],
              group: apiGroup.name,
              matches: matches.filter(match => match.team1.name === teamName || match.team2.name === teamName)
            }
          })
        }
      )),
    };

    return tournament;
  }

  return null;
}
