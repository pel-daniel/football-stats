import { Match, Group, MatchResult, TeamScores, ApiTournamentMatches } from "./apiClient";
import { countryToIso2 } from "./countryUtils";

export const getScores = (tournamentMatches: ApiTournamentMatches): TeamScores => {
  const teamScores: TeamScores = {};

  tournamentMatches.matches.forEach(match => {
    const score1 = match.score1 ?? (match.score?.ft && match.score.ft[0]);
    const score2 = match.score2 ?? (match.score?.ft && match.score.ft[1]);
    const team1Code = countryToIso2[match.team1];
    const team2Code = countryToIso2[match.team2];

    if(!(team1Code in teamScores)) {
      teamScores[team1Code] = {
        points: 0,
        for: 0,
        against: 0,
        difference: 0,
      }
    }

    if(!(team2Code in teamScores)) {
      teamScores[team2Code] = {
        points: 0,
        for: 0,
        against: 0,
        difference: 0,
      }
    }

    let pointsTeam1 = 0;
    let pointsTeam2 = 0;

    if(score1 !== undefined && score2 !== undefined) {
      if(score1 > score2) {
        pointsTeam1 = 3;
      } else if(score2 > score1) {
        pointsTeam2 = 3;
      } else {
        pointsTeam1 = 1;
        pointsTeam2 = 1;
      }
    }

    if(score1 !== undefined && score2 !== undefined && match.round.startsWith("Matchday")) {
      teamScores[team1Code].for += score1;
      teamScores[team1Code].against += score2;
      teamScores[team1Code].difference += (score1 - score2);
      teamScores[team1Code].points += pointsTeam1;

      teamScores[team2Code].for += score2;
      teamScores[team2Code].against += score1;
      teamScores[team2Code].difference += (score2 - score1);
      teamScores[team2Code].points += pointsTeam2;
    }
  });

  return teamScores;
};

export const getMatchResult = (match: Match, teamCode: string): MatchResult => {
  const [fullTimeScore1, fullTimeScore2] = match.score.ft || [undefined, undefined];
  const [extraTimeScore1, extraTimeScore2] = match.score.et || [undefined, undefined];
  const [penaltiesScore1, penaltiesScore2] = match.score.p || [undefined, undefined];
  const score1 = penaltiesScore1 || extraTimeScore1 || fullTimeScore1;
  const score2 = penaltiesScore2 || extraTimeScore2 || fullTimeScore2;

  const score = match.team1.code === teamCode ? score1 : score2;
  const scoreAgainst = match.team1.code !== teamCode ? score1 : score2;

  if(score === undefined || scoreAgainst === undefined) {
    return 'pending';
  } else if(score > scoreAgainst) {
    return 'win';
  } else if(scoreAgainst > score) {
    return 'lose';
  } else {
    return 'draw';
  }
};

export const getGroupIndex = (code: string, groups: Group[]) => {
  return groups.findIndex(group => group.teams.some(team => team.code === code)) + 1;
};
