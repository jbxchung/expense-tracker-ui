import { ButtonVariants } from 'components/Button/Button';
import DatePicker from 'components/DatePicker/DatePicker';
import Dropdown from 'components/Dropdown/Dropdown';
import Input from 'components/Input/Input';

import { UNKNOWN_CATEGORY, type Category } from 'types/category';
import type { EditableColumnDef } from 'types/table';

import { DescriptionEditCell } from './DescriptionEditCell';

import styles from '../TransactionTable.module.scss';

// parameterized functions for type safety
export const dateColumn = <T extends object>(): EditableColumnDef<T> => ({
  accessorKey: 'date',
  header: 'Date',
  enableColumnFilter: false,
  enableHiding: false,
  cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
  editCell: ({ getValue, setValue }) => (
    <DatePicker
      value={getValue()}
      onChange={setValue}
    />
  ),
});

export const amountColumn = <T extends object>(): EditableColumnDef<T> => ({
  accessorKey: 'amount',
  header: 'Amount',
  enableColumnFilter: false,
  enableHiding: false,
  className: styles.amountColumn,
  cell: ({ getValue }) => Number(getValue()).toFixed(2),
  editCell: ({ getValue, setValue }) => (
    <Input
      type="number"
      value={getValue()}
      onChange={e => setValue(parseFloat(e.target.value))}
    />
  ),
});

export const categoryColumn = <T extends object>(): EditableColumnDef<T> => ({
  accessorKey: 'categoryId',
  header: 'Category',
  enableColumnFilter: true,
  enableHiding: false,
  filterFn: (row, columnId, filterValue: string[]) => {
    if (!filterValue?.length) return true;
    const value = row.getValue<string | undefined>(columnId);
    if (filterValue.includes(UNKNOWN_CATEGORY)) {
      if (!value || value === '') return true;
    }
    return filterValue.includes(value ?? '');
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
});

export const descriptionColumn = <T extends object>(): EditableColumnDef<T> => ({
  accessorKey: 'description',
  header: 'Description',
  enableColumnFilter: false,
  enableHiding: false,
  cell: ({ getValue }) => getValue() ?? '',
  editCell: (props) => <DescriptionEditCell {...props} />,
});

export const originalDescriptionColumn = <T extends object>(): EditableColumnDef<T> => ({
  accessorKey: 'originalDescription',
  header: 'Original Description',
  enableColumnFilter: false,
  enableHiding: false,
  cell: ({ getValue }) => getValue() ?? '',
});
