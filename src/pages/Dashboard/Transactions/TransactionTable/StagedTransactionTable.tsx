import React from 'react';

import type { StagedTransaction } from 'types/transaction';

import { useAppContext } from 'contexts/app/AppContext';
import { useCategoryList } from 'hooks/categories/useCategories';

import { TransactionTable } from './TransactionTable';
import { StagedTransactionColumns } from './columns/StagedTransactionColumns';

type StagedTransactionTableProps = {
  data: StagedTransaction[];
  setData: React.Dispatch<React.SetStateAction<StagedTransaction[]>>;
};

// wrapper for staged transactions
export function StagedTransactionTable({ data, setData }: StagedTransactionTableProps) {
  const { accounts } = useAppContext();
  const { categories } = useCategoryList();

  const handleRowChange = (index: number, columnId: keyof StagedTransaction, value: any) => {
    setData(prev => prev.map((tx, i) => i === index ? { ...tx, [columnId]: value } : tx));
  };

  return (
    <TransactionTable
      data={data}
      columns={StagedTransactionColumns}
      accounts={accounts}
      categories={categories}
      onRowChange={handleRowChange}
    />
  );
}
