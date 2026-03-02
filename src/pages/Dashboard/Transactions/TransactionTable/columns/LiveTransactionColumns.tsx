import { ButtonVariants } from 'components/Button/Button';
import Dropdown from 'components/Dropdown/Dropdown';

import { UNKNOWN_CATEGORY, type Category } from 'types/category';
import type { EditableColumnDef } from 'types/table';
import type { Transaction } from 'types/transaction';

import { dateColumn, amountColumn, descriptionColumn, originalDescriptionColumn } from './base';

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

const liveCategoryColumn: EditableColumnDef<Transaction> = {
  accessorKey: 'categoryId',
  header: 'Category',
  enableColumnFilter: true,
  enableHiding: false,
  filterFn: (row, columnId, filterValue) => {
    const value = row.getValue<string | undefined>(columnId);
    if (filterValue === UNKNOWN_CATEGORY) return !value || value === '';
    return value === filterValue;
  },
  cell: ({ getValue, table }) => {
    const category = table.options.meta?.categories?.find(c => c.id === getValue<string>());
    return category?.name ?? 'Unknown';
  },
  editCell: ({ getValue, setValue, table }) => (
    <Dropdown
      buttonStyleVariant={ButtonVariants.GHOST}
      value={getValue()}
      options={table.options.meta!.categories!.map((c: Category) => ({ value: c.id, label: c.name }))}
      onChange={setValue}
    />
  ),
};

export const LiveTransactionColumns: EditableColumnDef<Transaction>[] = [
  dateColumn<Transaction>(),
  amountColumn<Transaction>(),
  accountColumn,
  liveCategoryColumn,
  descriptionColumn<Transaction>(),
  originalDescriptionColumn<Transaction>(),
];
