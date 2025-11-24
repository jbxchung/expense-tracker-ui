import { useEffect, type FC } from 'react';

import { useAccounts } from 'hooks/accounts/useAccounts';
import { useLocalStorage } from 'hooks/useLocalStorage';

import AccountSelector from './AccountSelector/AccountSelector';
import TransactionCard from './TransactionCard/TransactionCard';

const STORED_SELECTED_ACCOUNTS_KEY = 'selectedAccountIds';


const Dashboard: FC = () => {
  const { accounts, isLoading: accountsLoading, error: accountsError } = useAccounts();
  const [selectedAccountIds, setSelectedAccountIds] = useLocalStorage<string[]>(STORED_SELECTED_ACCOUNTS_KEY, []);
  

  useEffect(() => {
    if (accounts.length === 0) return;

    setSelectedAccountIds(prev => {
      // handle deletion
      const filtered = prev.filter(id => accounts.some(a => a.id === id));
      // default to select all
      return filtered.length > 0 ? filtered : accounts.map(a => a.id);
    });
  }, [accounts]);

  const toggleAccount = (id: string) => {
    setSelectedAccountIds((prev) => (
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    ));
  };

  const selectedAccounts = accounts.filter((a) => selectedAccountIds.includes(a.id));

  return (<>
    <AccountSelector accounts={accounts} isLoading={accountsLoading} error={accountsError} selectedIds={selectedAccountIds} onToggle={toggleAccount} />
    <TransactionCard
      accountsLoading={accountsLoading}
      selectedAccounts={selectedAccounts}
    />
  </>);
};

export default Dashboard;
