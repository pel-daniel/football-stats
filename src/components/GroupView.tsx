import { GroupCard } from '../components/GroupCard';
import { Tournament } from '../utils/apiClient';

import styles from './GroupView.module.css';

export const GroupView = ({ tournament }: { tournament: Tournament }) => {
  return (
    <div className={styles['groups']}>
      {tournament.groups.map((group, index) =>
        <GroupCard group={group} index={index + 1} key={group.name.replaceAll(" ", "-")} />
      )}
    </div>
  );
}
