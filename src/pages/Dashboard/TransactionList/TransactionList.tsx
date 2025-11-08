import type { FC } from 'react';

import type { Account } from 'types/account';

import Card from 'components/Card/Card';

interface TransactionListProps {
  accountsLoading: boolean;
  selectedAccounts: Account[];
}

const TransactionList: FC<TransactionListProps> = ({
  accountsLoading,
  selectedAccounts,
}) => {
  return (
    <Card title="Transactions">
      {
        selectedAccounts.map(account => (
          <div key={account.id}>TODO: show transactions for account: {account.name}</div>
        ))
      }
    </Card>
  );
};

export default TransactionList;