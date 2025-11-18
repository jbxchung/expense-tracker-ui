import { useMemo, useState, type FC } from 'react';

import type { Account } from 'types/account';
import { type DateRange } from 'components/DatePicker/DatePicker';

import { useTransactions } from 'hooks/useTransactions';

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
  // memoize account ids so that useTransactions doesn't refetch on every render
  const accountIds = useMemo(() => (
    selectedAccounts.map(acc => acc.id)
  ), [selectedAccounts]);

  const { transactions, isLoading, error } = useTransactions({
    accountIds,
    from: dateRange.from!, to: dateRange.to! });

  if (accountsLoading) return <div>Loading accounts...</div>;
  if (isLoading) return <div>Loading transactions...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!transactions.length) return <div>No transactions found</div>;

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