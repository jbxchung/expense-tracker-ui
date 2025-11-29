import type { ColumnDef, Table } from '@tanstack/react-table';

import type { Account } from './account';
import type { Category } from './category';

// let us edit cells
export type EditCellProps<TData> = {
  getValue: () => any;
  setValue: (value: any) => void;
  row: { index: number; original: TData };
  column: ColumnDef<TData>;
  table: Table<TData>;
};

// extend Tanstack's ColumnDef with our optional editCell render
export type EditableColumnDef<TData> = ColumnDef<TData> & {
  editCell?: (props: EditCellProps<TData>) => React.ReactNode;
};

// extend Tanstack's TableMeta to give our account/category lists and a way to update the underlying data when a cell is edited
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends unknown> {
    updateCellValue?: (
      rowIndex: number,
      columnId: keyof TData,
      value: any
    ) => void;

    accounts?: Account[];
    categories?: Category[];
  }
}