import { Link } from "react-router";

const tournaments = [
  {
    name: "Euro",
    years: [2020, 2024]
  },
  {
    name: "Worldcup",
    years: [2014, 2018]
  }
];

export const TournamentSelectPage = () => {
  return (
    <div>
      {tournaments.map(tournament =>
        <div key={tournament.name}>
          <h2>{tournament.name}</h2>

          <ul>
            {tournament.years.map(year =>
              <li key={year}>
                <Link to={`tournaments/${tournament.name.toLowerCase()}/${year}`}>{year}</Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
};
