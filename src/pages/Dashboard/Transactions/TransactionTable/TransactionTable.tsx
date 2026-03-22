import { useCallback, useMemo, useState } from 'react';
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
import type { FlattenedCategory } from 'types/category';

import Multiselect from 'components/Multiselect/Multiselect';
import { FilterIcon } from 'icons/FilterIcon';

import styles from './TransactionTable.module.scss';
import Button, { ButtonVariants } from 'components/Button/Button';
import { TrashIcon } from 'icons/TrashIcon';

type TransactionTableProps<T> = {
  data: T[];
  columns: EditableColumnDef<T>[];
  accounts?: Account[];
  categories?: FlattenedCategory[];
  onRowChange?: (index: number, columnId: keyof T, value: any) => void;
  onRowDelete?: (index: number) => void;
};

export function TransactionTable<T>({ data, columns, accounts = [], categories = [], onRowChange, onRowDelete }: TransactionTableProps<T>) {
  const [hoveredCell, setHoveredCell] = useState<{ rowIndex: number; columnId: string } | null>(null);
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnId: string } | null>(null);

  const updateCellValue = useCallback(
    (rowIndex: number, columnId: keyof T, value: any) => {
      onRowChange?.(rowIndex, columnId, value);
    },
    [onRowChange]
  );

  const nonSpendingCategoryIds = useMemo(() => new Set(
    categories
      .filter(c => c.excludeFromReports)
      .flatMap(c => [c.id, ...(c.descendantIds ?? [])])
  ), [categories]);

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
              {hg.headers.map((header) => {
                const filterValue = (header.column.getFilterValue() ?? []) as string[];
                const isFiltered = filterValue.length > 0;

                return (
                  <th key={header.id}>
                    <div className={styles.headerContent}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanFilter() && (
                        <div className={styles.filterIcon}>
                          <Multiselect
                            options={[{ value: UNKNOWN_CATEGORY, label: 'Unknown' }, ...categories.map(category => ({
                              value: category.id,
                              label: category.name,
                              depth: category.depth,
                              descendantIds: category.descendantIds,
                              ancestorIds: category.ancestorIds,
                            }))]}
                            value={(header.column.getFilterValue() ?? []) as string[]}
                            onChange={val => header.column.setFilterValue(val.length ? val : undefined)}
                            trigger={<FilterIcon className={styles.filterIcon + (isFiltered ? ' active' : '')} />}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
              {onRowDelete && <th className={styles.deleteCell} />} {/* empty header for delete column */}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={nonSpendingCategoryIds.has((row.original as any).categoryId) ? styles.balancedCategory : ''}
            >
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
              {onRowDelete && (
                <td className={styles.deleteCell}>
                  <Button
                    className={styles.deleteIcon}
                    variant={ButtonVariants.ICON}
                    onClick={() => onRowDelete(row.index)}
                    title="Delete transaction"
                  >
                    <TrashIcon />
                  </Button>
                </td>
              )}
            </tr>
          ))}
          {table.getRowModel().rows.length === 0 && (
            <tr>
              <td colSpan={columns.length}>
                {table.getState().columnFilters.length > 0
                  ? 'No transactions match the current filters.'
                  : 'No transactions found for the selected date range.'
                }
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
