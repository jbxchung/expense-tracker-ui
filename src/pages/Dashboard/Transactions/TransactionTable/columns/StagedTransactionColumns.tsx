import { ButtonVariants } from 'components/Button/Button';
import Dropdown from 'components/Dropdown/Dropdown';

import { UNKNOWN_CATEGORY, type Category } from 'types/category';
import type { EditableColumnDef } from 'types/table';
import type { StagedTransaction } from 'types/transaction';

import { dateColumn, amountColumn, descriptionColumn, originalDescriptionColumn } from './base';

const stagedCategoryColumn: EditableColumnDef<StagedTransaction> = {
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

export const StagedTransactionColumns: EditableColumnDef<StagedTransaction>[] = [
  dateColumn<StagedTransaction>(),
  amountColumn<StagedTransaction>(),
  stagedCategoryColumn,
  descriptionColumn<StagedTransaction>(),
  originalDescriptionColumn<StagedTransaction>(),
];
