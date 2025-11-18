import { useState, type FC } from 'react';

import type { Account } from 'types/account';

import Card from 'components/Card/Card';
import { useTransactions } from 'hooks/useTransactions';
import { type DateRange } from 'components/DatePicker/Datepicker';

interface TransactionListProps {
  accountsLoading: boolean;
  selectedAccounts: Account[];
  dateRange: DateRange;
}

const TransactionList: FC<TransactionListProps> = ({
  accountsLoading,
  selectedAccounts,
  dateRange,
}) => {
  // const { transactions, isLoading, error } = useTransactions({ accountIds: selectedAccounts.map(acc => acc.id), from, to });

  return (
    <div>
      {
        selectedAccounts.map(account => (
          <div key={account.id}>TODO: show transactions for account: {account.name} from {dateRange.from?.toLocaleDateString()} to {dateRange.to?.toLocaleDateString()}</div>
        ))
      }
    </div>
  );
};

export default TransactionList;