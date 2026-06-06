import { Link } from "react-router";

import styles from "./TournamentSelectPage.module.css";

const tournaments = [
  // {
  //   name: "Euro",
  //   years: [2020, 2024]
  // },
  {
    name: "Worldcup",
    years: [2014, 2018, 2022, 2026]
  }
];

export const TournamentSelectPage = () => {
  return (
    <div>
      {tournaments.map(tournament =>
        <div key={tournament.name}>
          <div>
            <div className="flex mb-12">
              <img
                src={`/tournamentLogos/${tournament.name.toLowerCase()}.webp`}
                alt={`${tournament.name} logo`}
                className={styles['logo']}
              />
              <h1>{tournament.name}</h1>
            </div>
          </div>

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
