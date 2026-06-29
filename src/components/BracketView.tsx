import { Match, Tournament } from '../utils/apiClient';
import { MatchCard } from './MatchCard';

import styles from './BracketView.module.css';

const rounds = [
  "Round of 32",
  "Round of 16",
  "Quarter-final",
  "Quarter-finals",
  "Semi-final",
  "Semi-finals",
  // "Match for third place",
  "Final"
];

export const BracketView = ({ tournament }: { tournament: Tournament }) => {
  const matchesByRound = tournament.matches.reduce((acc: Record<string, Match[]>, match) => {
    if (!acc[match.round]) {
      acc[match.round] = [];
    }

    acc[match.round].push(match);
    return acc;
  }, {});
  const tournamentRounds = Object.keys(matchesByRound);

  return (
    <div className={styles["bracket"]}>
      { rounds
        .filter(round => tournamentRounds.some(tr => tr === round))
        .map(round => (
          <div key={round} className={styles["round"]}>
            { matchesByRound[round].map((match, index) =>
              <MatchCard key={index} match={match} groupIndex={0} direction="vertical" />
            )}
          </div>
      ))}
    </div>
  );
}
