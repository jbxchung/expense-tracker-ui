import { useCallback, useMemo, useState, type FC } from 'react';

import type { Account } from 'types/account';

import { useLocalStorage } from 'hooks/useLocalStorage';
import { useTransactions } from 'hooks/transactions/useTransactions';

import Button, { ButtonVariants } from 'components/Button/Button';
import Card from 'components/Card/Card';
import DatePicker from 'components/DatePicker/DatePicker';
import { DatePickerModes, type DateRange } from 'components/DatePicker/DatePicker';
import Modal from 'components/Modal/Modal';
import { UploadIcon } from 'icons/UploadIcon';

import TransactionForm from './TransactionForm/TransactionForm';

import styles from './Transactions.module.scss';
import { LiveTransactionTable } from './TransactionTable/LiveTransactionTable';

const STORED_SELECTED_DATE_PRESET_INDEX_KEY = 'selectedDatePresetIndex';

const TRANSACTIONS_DATEPICKER_PRESETS = [
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

interface TransactionListProps {
  accountsLoading: boolean;
  selectedAccounts: Account[];
}

const Transactions: FC<TransactionListProps> = ({
  accountsLoading,
  selectedAccounts,
}) => {
  // memoize account ids so that useTransactions doesn't refetch on every render
  const accountIds = useMemo(() => (
    selectedAccounts.map(acc => acc.id)
  ), [selectedAccounts]);

  const [selectedDatePresetIndex, setSelectedDatePresetIndex] = useLocalStorage<number>(STORED_SELECTED_DATE_PRESET_INDEX_KEY, 0);
  // memoize the default date range
  const initialDateRange = useMemo(() => TRANSACTIONS_DATEPICKER_PRESETS[selectedDatePresetIndex].getRange(), [selectedDatePresetIndex]);
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);

  const onDateRangeChanged = useCallback((range: DateRange) => {
    if (range.from && range.to) {
      setDateRange(range);
    }
  }, []);

  const { transactions, setTransactions, isLoading, error } = useTransactions({
    accountIds,
    from: dateRange.from!, to: dateRange.to!
  });

  const [importModalOpen, setImportModalOpen] = useState(false);

  let statusText = null;
  if (accountsLoading) statusText = 'Loading accounts...';
  if (isLoading) statusText = 'Loading transactions...';
  if (error) statusText = `Error loading transactions: ${error.message}`;

  return (
    <Card title="Transactions">
      <div className={styles.transactionHeaderRow}>
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
        <Button
          className={styles.importButton}
          title="Import Transactions"
          variant={ButtonVariants.GHOST}
          onClick={() => setImportModalOpen(true)}
        >
          <UploadIcon />
        </Button>
      </div>
      {statusText ? (
        <div>{statusText}</div>
      ) : (
        <LiveTransactionTable data={transactions} setData={setTransactions}/>
      )}
      <Modal
        title="Import Transactions"
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        closeOnOutsideClick={false}
        confirmOnClose
      >
        <TransactionForm onSuccess={() => setImportModalOpen(false)} />
      </Modal>
    </Card>
  );
};

export default Transactions;