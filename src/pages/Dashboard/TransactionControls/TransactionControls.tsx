import { type FC } from 'react';

import type { Account } from 'types/account';
import Card from 'components/Card/Card';
import DatePicker, { DatePickerModes, type DateRange } from 'components/DatePicker/DatePicker';

import AccountSelector from './AccountSelector/AccountSelector';
import { TRANSACTIONS_DATEPICKER_PRESETS } from './presets';

import styles from './TransactionControls.module.scss'

interface TransactionControlsProps {
  accounts: Account[];
  accountsLoading: boolean;
  accountsError: Error | null;
  selectedAccountIds: string[];
  onToggleAccount: (id: string) => void;
  dateRange: DateRange;
  selectedDatePresetIndex: number;
  onDateRangeChanged: (range: DateRange) => void;
  onPresetSelected: (preset: typeof TRANSACTIONS_DATEPICKER_PRESETS[number] | null) => void;
}

const TransactionControls: FC<TransactionControlsProps> = ({
  accounts,
  accountsLoading,
  accountsError,
  selectedAccountIds,
  onToggleAccount,
  dateRange,
  selectedDatePresetIndex,
  onDateRangeChanged,
  onPresetSelected,
}) => {
  return (
    <Card title="Filters">
      <div className={styles.transactionControls}>
        <div className={styles.transactionControl}>
          <span className={styles.title}>Date range:</span>
          <DatePicker
            mode={DatePickerModes.RANGE}
            range={dateRange}
            onChange={range => onDateRangeChanged(range as DateRange)}
            presets={TRANSACTIONS_DATEPICKER_PRESETS}
            selectedPresetIndex={selectedDatePresetIndex}
            onPresetSelected={onPresetSelected}
          />
        </div>
        <div className={styles.transactionControl}>
          <span className={styles.title}>Accounts:</span>
          <AccountSelector
            accounts={accounts}
            isLoading={accountsLoading}
            error={accountsError}
            selectedIds={selectedAccountIds}
            onToggle={onToggleAccount}
          />
        </div>
      </div>
    </Card>
  );
};

export default TransactionControls;
