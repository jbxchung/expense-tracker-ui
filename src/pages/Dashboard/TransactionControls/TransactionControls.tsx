import { type FC } from 'react';

import type { Account } from 'types/account';
import Card from 'components/Card/Card';
import DatePicker, { DatePickerModes, type DateRange } from 'components/DatePicker/DatePicker';

import AccountSelector from './AccountSelector/AccountSelector';
import { TRANSACTIONS_DATEPICKER_PRESETS } from './presets';

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
      <AccountSelector
        accounts={accounts}
        isLoading={accountsLoading}
        error={accountsError}
        selectedIds={selectedAccountIds}
        onToggle={onToggleAccount}
      />
      <DatePicker
        mode={DatePickerModes.RANGE}
        range={dateRange}
        onChange={range => onDateRangeChanged(range as DateRange)}
        presets={TRANSACTIONS_DATEPICKER_PRESETS}
        selectedPresetIndex={selectedDatePresetIndex}
        onPresetSelected={onPresetSelected}
      />
    </Card>
  );
};

export default TransactionControls;
