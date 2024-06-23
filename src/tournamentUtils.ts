import { ApiTournamentMatches, Group, TeamScores } from "./apiClient";

export const getScores = (tournamentMatches: ApiTournamentMatches): TeamScores => {
  const teamScores: TeamScores = {};

  tournamentMatches.rounds.forEach(round => {
    round.matches.forEach(match => {
      // const score1 = match.score1;
      // const score2 = match.score2;
      const score1 = match.score.ft && match.score.ft[0];
      const score2 = match.score.ft && match.score.ft[1];

      if(!(match.team1.code in teamScores)) {
        teamScores[match.team1.code] = {
          points: 0,
          for: 0,
          against: 0,
          difference: 0,
          matchResults: [],
        }
      }

      if(!(match.team2.code in teamScores)) {
        teamScores[match.team2.code] = {
          points: 0,
          for: 0,
          against: 0,
          difference: 0,
          matchResults: [],
        }
      }

      let pointsTeam1 = 0;
      let pointsTeam2 = 0;

      if(score1 === undefined || score2 === undefined) {
        teamScores[match.team1.code].matchResults.push('pending');
        teamScores[match.team2.code].matchResults.push('pending');
      } else if(score1 > score2) {
        pointsTeam1 = 3;
        teamScores[match.team1.code].matchResults.push('win');

        teamScores[match.team2.code].matchResults.push('lose');
      } else if(score2 > score1) {
        teamScores[match.team1.code].matchResults.push('lose');

        pointsTeam2 = 3;
        teamScores[match.team2.code].matchResults.push('win');
      } else {
        pointsTeam1 = 1;
        teamScores[match.team1.code].matchResults.push('draw');

        pointsTeam2 = 1;
        teamScores[match.team2.code].matchResults.push('draw');
      }

      if(score1 !== undefined && score2 !== undefined && round.name.startsWith("Matchday")) {
        teamScores[match.team1.code].for += score1;
        teamScores[match.team1.code].against += score2;
        teamScores[match.team1.code].difference += (score1 - score2);
        teamScores[match.team1.code].points += pointsTeam1;

        teamScores[match.team2.code].for += score2;
        teamScores[match.team2.code].against += score1;
        teamScores[match.team2.code].difference += (score2 - score1);
        teamScores[match.team2.code].points += pointsTeam2;
      }
    });
  });

  return teamScores;
}

export const getGroupIndex = (code: string, groups: Group[]) => {
  return groups.findIndex(group => group.teams.some(team => team.code === code)) + 1;
}
