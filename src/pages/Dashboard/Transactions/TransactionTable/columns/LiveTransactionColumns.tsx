import type { EditableColumnDef } from 'types/table';
import type { Transaction } from 'types/transaction';

import { dateColumn, amountColumn, descriptionColumn, originalDescriptionColumn, categoryColumn } from './base';

const accountColumn: EditableColumnDef<Transaction> = {
  accessorKey: 'accountId',
  header: 'Account',
  enableColumnFilter: false,
  enableHiding: false,
  cell: ({ getValue, table }) => {
    const account = table.options.meta?.accounts?.find(a => a.id === getValue<string>());
    return account?.name ?? getValue<string>();
  },
};

export const LiveTransactionColumns: EditableColumnDef<Transaction>[] = [
  dateColumn<Transaction>(),
  amountColumn<Transaction>(),
  accountColumn,
  categoryColumn<Transaction>(),
  descriptionColumn<Transaction>(),
  originalDescriptionColumn<Transaction>(),
];
