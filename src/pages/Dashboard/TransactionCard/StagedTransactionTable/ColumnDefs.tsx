import type { TableMeta } from '@tanstack/react-table';
import DatePicker from 'components/DatePicker/DatePicker';
import { Dropdown } from 'components/Dropdown/Dropdown';
import Input from 'components/Input/Input';
import type { Account } from 'types/account';
import type { Category } from 'types/category';
import type { EditableColumnDef } from 'types/table';
import type { StagedTransaction } from 'types/transaction';

import styles from './StagedTransactionTable.module.scss';

export const TransactionTableColumns: EditableColumnDef<StagedTransaction>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    enableHiding: false,
    cell: ({ getValue }) => {
      const date = new Date(getValue<string>());
      return date.toLocaleDateString();
    },
    editCell: ({ getValue, setValue }) => (
      <DatePicker
        value={getValue()}
        onChange={(newVal) => setValue(newVal)}
      />
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    enableHiding: false,
    className: styles.amountColumn,
    cell: ({ getValue }) => {
      const num = Number(getValue());
      return num.toFixed(2);
    },
    editCell: ({ getValue, setValue }) => (
      <Input
        type='number'
        value={getValue()}
        onChange={(e) => setValue(parseFloat(e.target.value))}
      />
    ),
  },
  // StagedTransactions all have the same Account
  // {
  //   accessorKey: 'accountId',
  //   header: 'Account',
  //   enableHiding: false,
  //   cell: ({ getValue, table }) => {
  //     const accountId = getValue() as string;

  //     // there should never be so many accounts that this affect performance considerably
  //     const account = table.options.meta?.accounts?.find(a => a.id === accountId);
      
  //     return account?.name ?? accountId;
  //   },
  //   editCell: ({ getValue, setValue, table }) => (
  //     <Dropdown
  //       value={getValue()}
  //       options={table.options.meta!.accounts!.map((a: Account) => ({ value: a.id, label: a.name }))}
  //       onChange={setValue}
  //     />
  //   ),
  // },
  {
    accessorKey: 'category',
    header: 'Category',
    enableHiding: false,
    cell: ({ getValue, table  }) => {
      const categoryId = getValue() as string;

      // there should never be so many categories that this affect performance considerably
      const category = table.options.meta!.categories!.find(c => c.id === categoryId);

      return category?.name ?? 'Unknown';
    },
    editCell: ({ getValue, setValue, table }) => (
      <Dropdown
        value={getValue()}
        options={table.options.meta!.categories!.map((c: Category) => ({ value: c.id, label: c.name }))}
        onChange={setValue}
      />
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    enableHiding: false,
    cell: ({ getValue }) => getValue() ?? '',
    editCell: ({ getValue, setValue }) => (
      <Input value={getValue() ?? ''} onChange={setValue} />
    ),
  },
];
