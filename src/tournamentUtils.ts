import { ApiTournamentMatches, TeamScores } from "./apiClient";

export const getScores = (tournamentMatches: ApiTournamentMatches): TeamScores => {
  const teamScores: TeamScores = {};

  tournamentMatches.rounds.forEach(round => {
    round.matches.forEach(match => {
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

      if(match.score1 > match.score2) {
        pointsTeam1 = 3;
        teamScores[match.team1.code].matchResults.push('win');

        teamScores[match.team2.code].matchResults.push('lose');
      } else if(match.score2 > match.score1) {
        teamScores[match.team1.code].matchResults.push('lose');

        pointsTeam2 = 3;
        teamScores[match.team2.code].matchResults.push('win');
      } else {
        pointsTeam1 = 1;
        teamScores[match.team1.code].matchResults.push('draw');

        pointsTeam2 = 1;
        teamScores[match.team2.code].matchResults.push('draw');
      }

      if(round.name.startsWith("Matchday")) {
        teamScores[match.team1.code].for += match.score1;
        teamScores[match.team1.code].against += match.score2;
        teamScores[match.team1.code].difference += (match.score1 - match.score2);
        teamScores[match.team1.code].points += pointsTeam1;

        teamScores[match.team2.code].for += match.score2;
        teamScores[match.team2.code].against += match.score1;
        teamScores[match.team2.code].difference += (match.score2 - match.score1);
        teamScores[match.team2.code].points += pointsTeam2;
      }
    });
  });

  return teamScores;
}
