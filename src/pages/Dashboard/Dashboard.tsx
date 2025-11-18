import { useEffect, useState, type FC } from 'react';

import { useAccounts } from 'hooks/useAccounts';
import { useLocalStorage } from 'hooks/useLocalStorage';

import AccountSelector from './AccountSelector/AccountSelector';
import TransactionList from './TransactionList/TransactionList';
import Card from 'components/Card/Card';
import DatePicker, { DatePickerModes, type DateRange } from 'components/DatePicker/Datepicker';

const STORED_SELECTED_ACCOUNTS_KEY = 'selectedAccountIds';

const DATEPICKER_PRESETS = [
  { label: "Last 7 Days", getRange: () => ({ from: new Date(Date.now() - 7 * 24*60*60*1000), to: new Date() }) },
  { label: "This Month", getRange: () => {
      const now = new Date();
      return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: new Date() };
    } 
  },
  { label: "Last Month", getRange: () => {
      const now = new Date();
      return { from: new Date(now.getFullYear(), now.getMonth() - 1, 1), to: new Date(now.getFullYear(), now.getMonth(), 0) };
    }
  },
  { label: "Last 3 Months", getRange: () => {
      const now = new Date();
      return { from: new Date(now.getFullYear(), now.getMonth() - 3, 1), to: new Date(now.getFullYear(), now.getMonth(), 0) };
    }
  },
  { label: "YTD", getRange: () => {
      const now = new Date();
      return { from: new Date(now.getFullYear(), 0, 1), to: now };
    } 
  },
];

const Dashboard: FC = () => {
  const { accounts, isLoading: accountsLoading, error: accountsError } = useAccounts();
  const [selectedAccountIds, setSelectedAccountIds] = useLocalStorage<string[]>(STORED_SELECTED_ACCOUNTS_KEY, []);
  
  // Track date range for transactions
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });


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
    <Card title="Transactions">
      <DatePicker
        mode={DatePickerModes.RANGE}
        range={dateRange}
        onChange={(range) => setDateRange(range as DateRange)}
        presets={DATEPICKER_PRESETS}
      />
      <TransactionList accountsLoading={accountsLoading} selectedAccounts={selectedAccounts} dateRange={dateRange} />
    </Card>
  </>);
};

export default Dashboard;