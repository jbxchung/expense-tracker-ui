import type { FC } from 'react';
// import { Link } from 'react-router-dom';

import type { Account } from 'types/account';
// import Button, { ButtonVariants } from 'components/Button/Button';
import Card from 'components/Card/Card';

import styles from './AccountSelector.module.scss';

interface AccountSelectorProps {
  isLoading: boolean;
  error: Error | null;
  accounts: Account[];
  selectedIds: string[],
  onToggle: (id: string) => void;
}

const AccountSelector: FC<AccountSelectorProps> = ({
  isLoading,
  error,
  accounts,
  selectedIds,
  onToggle,
}) => {
  if (isLoading) {
    return (
      <Card title="Loading accounts...">
        loading spinner placeholder
      </Card>
    );
  }
  if (error) {
    return (
      <Card title="Error loading accounts">
        {error.message}
      </Card>
    );
  }

  // sort accounts alphabetically by name
  accounts.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className={styles.accountSelector}>
      <div className={styles.accountSelectorList}>
      {accounts.length ? (
        accounts.map(account => {
          const selected = selectedIds.includes(account.id);
          return (
            <div key={account.id} title={account.id} className={`${styles.accountListItem} ${selected ? styles.selected : ''}`} onClick={() => onToggle(account.id)}>
              <span className={styles.accountName}>
                {account.name}
                <span className={styles.accountType}>
                  {account.type}
                </span>
              </span>
            </div>
          );
        })
      ) : (
        <div>
          No accounts found. Please add a new account.
        </div>
      )}
      </div>
    </div>
  );
};

export default AccountSelector;