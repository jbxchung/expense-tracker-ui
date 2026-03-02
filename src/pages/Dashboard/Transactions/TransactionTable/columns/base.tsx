import DatePicker from 'components/DatePicker/DatePicker';
import Input from 'components/Input/Input';

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
