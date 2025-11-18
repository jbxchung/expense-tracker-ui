import { useCallback, useEffect, useMemo, useState, type FC } from 'react';

import { useAccounts } from 'hooks/useAccounts';
import { useLocalStorage } from 'hooks/useLocalStorage';

import AccountSelector from './AccountSelector/AccountSelector';
import TransactionList from './TransactionList/TransactionList';
import Card from 'components/Card/Card';
import DatePicker, { DatePickerModes, type DateRange } from 'components/DatePicker/DatePicker';

const STORED_SELECTED_ACCOUNTS_KEY = 'selectedAccountIds';
const STORED_SELECTED_DATE_PRESET_INDEX_KEY = 'selectedDatePresetIndex';

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
  const [selectedDatePresetIndex, setSelectedDatePresetIndex] = useLocalStorage<number>(STORED_SELECTED_DATE_PRESET_INDEX_KEY, 0);
  // memoize the default date range
  const initialDateRange = useMemo(() => DATEPICKER_PRESETS[selectedDatePresetIndex].getRange(), [selectedDatePresetIndex]);
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);

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

  const onDateRangeChanged = useCallback((range: DateRange) => {
    if (range.from && range.to) {
      setDateRange(range);
    }
  }, []);

  const selectedAccounts = accounts.filter((a) => selectedAccountIds.includes(a.id));

  return (<>
    <AccountSelector accounts={accounts} isLoading={accountsLoading} error={accountsError} selectedIds={selectedAccountIds} onToggle={toggleAccount} />
    <Card title="Transactions">
      <DatePicker
        mode={DatePickerModes.RANGE}
        range={dateRange}
        onChange={range => onDateRangeChanged(range as DateRange)}
        presets={DATEPICKER_PRESETS}
        selectedPresetIndex={selectedDatePresetIndex}
        onPresetSelected={preset => {
          setSelectedDatePresetIndex(preset ? DATEPICKER_PRESETS.findIndex(p => p.label === preset.label) : 0);
        }}
      />
      <TransactionList
        accountsLoading={accountsLoading}
        selectedAccounts={selectedAccounts}
        dateRange={dateRange}
      />
    </Card>
  </>);
};

export default Dashboard;