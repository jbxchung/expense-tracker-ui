import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  type ColumnDef,
} from '@tanstack/react-table';

import { UNKNOWN_CATEGORY } from 'types/category';
import type { EditableColumnDef } from 'types/table';
import type { Account } from 'types/account';
import type { Category } from 'types/category';

import Dropdown from 'components/Dropdown/Dropdown';

import styles from './TransactionTable.module.scss';
import Multiselect from 'components/Multiselect/Multiselect';

type TransactionTableProps<T> = {
  data: T[];
  columns: EditableColumnDef<T>[];
  accounts?: Account[];
  categories?: Category[];
  onRowChange?: (index: number, columnId: keyof T, value: any) => void;
};

export function TransactionTable<T>({ data, columns, accounts = [], categories = [], onRowChange }: TransactionTableProps<T>) {
  const [hoveredCell, setHoveredCell] = React.useState<{ rowIndex: number; columnId: string } | null>(null);
  const [editingCell, setEditingCell] = React.useState<{ rowIndex: number; columnId: string } | null>(null);

  const updateCellValue = React.useCallback(
    (rowIndex: number, columnId: keyof T, value: any) => {
      onRowChange?.(rowIndex, columnId, value);
    },
    [onRowChange]
  );

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<T>[],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: {
      updateCellValue,
      accounts,
      categories,
    },
  });

  return (
    <div className={styles.tableContainer}>
      <table className={styles.transactionTable}>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getCanFilter() && (
                    // <Dropdown
                    //   placeholder="Filter"
                    //   options={[{ value: UNKNOWN_CATEGORY, label: 'Unknown' }, ...categories.map(category => ({
                    //     value: category.id,
                    //     label: category.name,
                    //   }))]}
                    //   value={(header.column.getFilterValue() ?? '') as string}
                    //   onChange={(val) => header.column.setFilterValue(val || undefined)}
                    // />
                    <Multiselect
                      options={[{ value: UNKNOWN_CATEGORY, label: 'Unknown' }, ...categories.map(category => ({
                        value: category.id,
                        label: category.name,
                      }))]}
                      value={(header.column.getFilterValue() ?? []) as string[]}
                      onChange={val => header.column.setFilterValue(val.length ? val : undefined)}
                      trigger={<span>⊟</span>}
                    />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                const col = cell.column.columnDef as EditableColumnDef<T>;
                const isHovered = hoveredCell?.rowIndex === row.index && hoveredCell?.columnId === cell.column.id;
                const isEditing = editingCell?.rowIndex === row.index && editingCell?.columnId === cell.column.id;
                const shouldShowEdit = !!col.editCell && (isHovered || isEditing);

                return (
                  <td
                    key={cell.id}
                    className={[shouldShowEdit ? styles.editing : '', col.className || ''].filter(Boolean).join(' ')}
                    onMouseEnter={() => setHoveredCell({ rowIndex: row.index, columnId: cell.column.id })}
                    onMouseLeave={() => setHoveredCell(null)}
                    onClick={() => col.editCell && setEditingCell({ rowIndex: row.index, columnId: cell.column.id })}
                  >
                    {shouldShowEdit ? (
                      <div
                        className={styles.cellEditor}
                        tabIndex={0}
                        onBlur={() => setEditingCell(null)}
                        onKeyDown={(e: React.KeyboardEvent) => {
                          if (e.key === 'Enter') setEditingCell(null);
                        }}
                      >
                        {col.editCell!({
                          getValue: cell.getValue,
                          row,
                          column: cell.column.columnDef,
                          table,
                          setValue: (newVal: any) =>
                            updateCellValue(row.index, cell.column.id as keyof T, newVal),
                        })}
                      </div>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
