import { useEffect, useState, type FC } from 'react';

import type { Account } from '../../api/accounts';
import { useAccounts } from '../../hooks/useAccounts';

import AccountSelector from './AccountSelector/AccountSelector';
import TransactionList from './TransactionList/TransactionList';
import Card from 'components/Card/Card';
import { useLocalStorage } from 'hooks/useLocalStorage';

// import styles from './Dashboard.scss';

const STORED_SELECTED_ACCOUNTS_KEY = 'selectedAccountIds';

const Dashboard: FC = () => {
  const { accounts, isLoading, error } = useAccounts();
  const [selectedIds, setSelectedIds] = useLocalStorage<string[]>(STORED_SELECTED_ACCOUNTS_KEY, []);
  
  useEffect(() => {
    if (accounts.length === 0) return;

    setSelectedIds(prev => {
      // handle deletion
      const filtered = prev.filter(id => accounts.some(a => a.id === id));
      // default to select all
      return filtered.length > 0 ? filtered : accounts.map(a => a.id);
    });
  }, [accounts]);

  const toggleAccount = (id: string) => {
    setSelectedIds((prev) => (
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    ));
  };

  const selectedAccounts = accounts.filter((a) => selectedIds.includes(a.id));

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

  return (<>
    <AccountSelector accounts={accounts} selectedIds={selectedIds} onToggle={toggleAccount} />
    <TransactionList selectedAccounts={selectedAccounts} />
  </>);
};

export default Dashboard;