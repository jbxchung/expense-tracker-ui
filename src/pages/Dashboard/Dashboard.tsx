import { useState, useEffect, type FC } from 'react';

import { useAppContext } from 'contexts/app/AppContext';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useTransactions } from 'hooks/transactions/useTransactions';

import DatePicker, { DatePickerModes, type DateRange } from 'components/DatePicker/DatePicker';

import AccountSelector from './AccountSelector/AccountSelector';
import Transactions from './Transactions/Transactions';

const STORED_SELECTED_ACCOUNTS_KEY = 'selectedAccountIds';
const STORED_SELECTED_DATE_PRESET_INDEX_KEY = 'selectedDatePresetIndex';

const TRANSACTIONS_DATEPICKER_PRESETS = [
  { label: "Last 7 Days", getRange: () => ({ from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), to: new Date() }) },
  { label: "This Month", getRange: () => {
    const now = new Date();
    return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: new Date() };
  }},
  { label: "Last Month", getRange: () => {
    const now = new Date();
    return { from: new Date(now.getFullYear(), now.getMonth() - 1, 1), to: new Date(now.getFullYear(), now.getMonth(), 0) };
  }},
  { label: "Last 3 Months", getRange: () => {
    const now = new Date();
    return { from: new Date(now.getFullYear(), now.getMonth() - 3, 1), to: new Date(now.getFullYear(), now.getMonth(), 0) };
  }},
  { label: "YTD", getRange: () => {
    const now = new Date();
    return { from: new Date(now.getFullYear(), 0, 1), to: now };
  }},
];

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
  const [dateRange, setDateRange] = useState<DateRange>(
    () => TRANSACTIONS_DATEPICKER_PRESETS[selectedDatePresetIndex].getRange()
  );

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
    <AccountSelector
      accounts={accounts}
      isLoading={accountsLoading}
      error={accountsError}
      selectedIds={selectedAccountIds}
      onToggle={toggleAccount}
    />
    <DatePicker
      mode={DatePickerModes.RANGE}
      range={dateRange}
      onChange={range => onDateRangeChanged(range as DateRange)}
      presets={TRANSACTIONS_DATEPICKER_PRESETS}
      selectedPresetIndex={selectedDatePresetIndex}
      onPresetSelected={preset => {
        setSelectedDatePresetIndex(preset ? TRANSACTIONS_DATEPICKER_PRESETS.findIndex(p => p.label === preset.label) : 0);
      }}
    />
    {/* charts card goes here later, receives transactions */}
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
