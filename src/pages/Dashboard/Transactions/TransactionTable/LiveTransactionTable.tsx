import type { Transaction } from 'types/transaction';

import { useAppContext } from 'contexts/app/AppContext';
import { useCategoryList } from 'hooks/categories/useCategories';
import { useUpdateTransaction } from 'hooks/transactions/useUpdateTransaction';

import { TransactionTable } from './TransactionTable';
import { LiveTransactionColumns } from './columns/LiveTransactionColumns';

type LiveTransactionTableProps = {
  data: Transaction[];
};

// wrapper to modify already-persisted transactions
export function LiveTransactionTable({ data }: LiveTransactionTableProps) {
  const { accounts } = useAppContext();
  const { categories } = useCategoryList();
  const { update } = useUpdateTransaction();

  const handleRowChange = (index: number, columnId: keyof Transaction, value: any) => {
    const transaction = data[index];
    console.log('Updating transaction', transaction.id, 'column', columnId, 'to value', value);
    update({ id: transaction.id, [columnId]: value });
  };

  return (
    <TransactionTable
      data={data}
      columns={LiveTransactionColumns}
      accounts={accounts}
      categories={categories}
      onRowChange={handleRowChange}
    />
  );
}