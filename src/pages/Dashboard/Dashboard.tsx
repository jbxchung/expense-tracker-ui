import { useState, useEffect, type FC, useMemo } from 'react';

import { useAppContext } from 'contexts/app/AppContext';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useTransactions } from 'hooks/transactions/useTransactions';

import type { DateRange } from 'components/DatePicker/DatePicker';

import TransactionControls from './TransactionControls/TransactionControls';
import { TRANSACTIONS_DATEPICKER_PRESETS } from './TransactionControls/presets';
import Charts from './Charts/Tooltips/Charts';
import Transactions from './Transactions/Transactions';

const STORED_SELECTED_ACCOUNTS_KEY = 'selectedAccountIds';
const STORED_SELECTED_DATE_PRESET_INDEX_KEY = 'selectedDatePresetIndex';

const Dashboard: FC = () => {
  const { accounts, accountsLoading, accountsError } = useAppContext();

  // account selection and persistence
  const [selectedAccountIds, setSelectedAccountIds] = useLocalStorage<string[]>(STORED_SELECTED_ACCOUNTS_KEY, []);

  useEffect(() => {
    if (accounts.length === 0) return;
    setSelectedAccountIds(prev => {
      const filtered = prev.filter(id => accounts.some(a => a.id === id));
      return filtered.length > 0 ? filtered : accounts.map(a => a.id);
    });
  }, [accounts, setSelectedAccountIds]);

  const toggleAccount = (id: string) => {
    setSelectedAccountIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // date range selection / preset persistence
  const [selectedDatePresetIndex, setSelectedDatePresetIndex] = useLocalStorage<number>(STORED_SELECTED_DATE_PRESET_INDEX_KEY, 0);
  // memoize the default date range
  const initialDateRange = useMemo(() => TRANSACTIONS_DATEPICKER_PRESETS[selectedDatePresetIndex].getRange(), [selectedDatePresetIndex]);
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);

  const onDateRangeChanged = (range: DateRange) => {
    if (range.from && range.to) setDateRange(range);
  };

  // transaction retrieval for selected accounts and date range
  const { transactions, setTransactions, isLoading, error } = useTransactions({
    accountIds: selectedAccountIds,
    from: dateRange.from!,
    to: dateRange.to!,
  });

  return (<>
    <TransactionControls
      accounts={accounts}
      accountsLoading={accountsLoading}
      accountsError={accountsError}
      selectedAccountIds={selectedAccountIds}
      onToggleAccount={toggleAccount}
      dateRange={dateRange}
      selectedDatePresetIndex={selectedDatePresetIndex}
      onPresetSelected={preset => setSelectedDatePresetIndex(preset?.index ?? 0)}
      onDateRangeChanged={onDateRangeChanged}
    />
    {/* charts card goes here later, receives transactions */}
    <Charts accounts={accounts} transactions={transactions} dateRange={{ from: dateRange.from!, to: dateRange.to! }} />
    <Transactions
      accountsLoading={accountsLoading}
      isLoading={isLoading}
      error={error}
      transactions={transactions}
      setTransactions={setTransactions}
    />
  </>);
};

export default Dashboard;
