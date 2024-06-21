const baseUrl = 'https://raw.githubusercontent.com/openfootball';

interface Team {
  name: string;
  code: string;
}

interface Match {
  date: string;
  time: string;
  team1: Team;
  team2: Team;
  score: Record<Team['code'], number>;
}

export interface TeamMatches {
  name: Team['name'];
  code: Team['code'];
  points: number;
  matches: Match[];
}

interface TeamRounds {
  name: string;
  rounds: TeamMatches[];
}

export interface Group {
  name: string;
  teams: TeamMatches[];
}

export interface Tournament {
  name: string;
  groups: Group[];
}

export const getTournament = async (tournamentName: string, year: number): Promise<Tournament | null> => {
  const tournamentResponse = await fetch(`${baseUrl}/${tournamentName}.json/master/${year}/${tournamentName}.groups.json`);
  const matchesResponse = await fetch(`${baseUrl}/${tournamentName}.json/master/${year}/${tournamentName}.json`);

  if(tournamentResponse.ok && matchesResponse.ok) {
    const tournament = await tournamentResponse.json();
    const matches = await matchesResponse.json();

    return {
      name: tournament.name,
      groups: tournament.groups.map(apiGroup => (
        {
          name: apiGroup.name,
          teams: apiGroup.teams.map(apiTeam => (
            {
              name: apiTeam.name,
              code: apiTeam.code,
              points: 0,
              matches: matches.rounds.flatMap(round =>
                round.matches.
                  filter(match => match.team1.code === apiTeam.code || match.team2.code === apiTeam.code)).
                  map(match => (
                    {
                      ...match,
                      score: {
                        [match.team1.code]: match.score1,
                        [match.team2.code]: match.score2,
                        // [match.team1.code]: match.score.ft[0],
                        // [match.team2.code]: match.score.ft[1],
                      }
                    }
                  )),
            }
          ))
        }
      )),
    };
  }

  return null;
}
