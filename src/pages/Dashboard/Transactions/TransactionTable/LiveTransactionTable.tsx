import type { Transaction } from 'types/transaction';

import { useAppContext } from 'contexts/app/AppContext';
import { useCategoryList } from 'hooks/categories/useCategories';
import { useUpdateTransaction } from 'hooks/transactions/useUpdateTransaction';

import { TransactionTable } from './TransactionTable';
import { LiveTransactionColumns } from './columns/LiveTransactionColumns';

type LiveTransactionTableProps = {
  data: Transaction[];
  setData: React.Dispatch<React.SetStateAction<Transaction[]>>;
};

// wrapper to modify already-persisted transactions
export function LiveTransactionTable({ data, setData }: LiveTransactionTableProps) {
  const { accounts } = useAppContext();
  const { categories } = useCategoryList();
  const { update } = useUpdateTransaction();

  const handleRowChange = async (index: number, columnId: keyof Transaction, value: any) => {
    const transaction = data[index];
    const updated = await update({ id: transaction.id, [columnId]: value });
    if (updated) {
      setData(prev => prev.map((tx, i) => i === index ? updated : tx));
    }
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