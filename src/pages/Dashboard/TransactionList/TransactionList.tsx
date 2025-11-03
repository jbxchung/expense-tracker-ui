import type { FC } from 'react';

import type { Account } from '../../../api/accounts';

import Card from 'components/Card/Card';

interface TransactionListProps {
  selectedAccounts: Account[];
}

const TransactionList: FC<TransactionListProps> = ({
  selectedAccounts,
}) => {
  return (
    <Card title="Transactions">
      {
        selectedAccounts.map(account => (
          <div>TODO: show transactions for account: {account.name}</div>
        ))
      }
    </Card>
  );
};

export default TransactionList;