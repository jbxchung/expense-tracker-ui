import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

import type { StagedTransaction } from 'types/transaction';
import type { EditableColumnDef } from 'types/table';
import { TransactionTableColumns } from './ColumnDefs';
import { useAccounts } from 'hooks/accounts/useAccounts';
import { useCategoryList } from 'hooks/useCategories';

import styles from './StagedTransactionTable.module.scss';

type StagedTransactionTableProps = {
  data: StagedTransaction[];
  setData: React.Dispatch<React.SetStateAction<StagedTransaction[]>>;
};

export function StagedTransactionTable({ data, setData }: StagedTransactionTableProps) {
  const { accounts } = useAccounts();
  const { categories } = useCategoryList();

  // for displaying editable controls
  const [hoveredCell, setHoveredCell] = React.useState<{
    rowIndex: number;
    columnId: string;
  } | null>(null);

  // for tracking when currently editing
  const [editingCell, setEditingCell] = React.useState<{
    rowIndex: number;
    columnId: string;
  } | null>(null);

  // For updating individual cell values
  const updateCellValue = React.useCallback(
    (rowIndex: number, columnId: string, value: any) => {
      setData((old) =>
        old.map((row, idx) =>
          idx === rowIndex
            ? { ...row, [columnId]: value }
            : row
        )
      );
    },
    [setData]
  );

  const table = useReactTable({
    data,
    columns: TransactionTableColumns as EditableColumnDef<StagedTransaction>[],
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateCellValue,
      accounts,
      categories,
    },
  });

  return (
    <div className={styles.tableContainer}>
      <table className={styles.stagedTransactionTable}>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                const col = cell.column.columnDef as EditableColumnDef<StagedTransaction>;
                const isHovered =
                  hoveredCell?.rowIndex === row.index &&
                  hoveredCell?.columnId === cell.column.id;

                const isEditing =
                  editingCell?.rowIndex === row.index &&
                  editingCell?.columnId === cell.column.id;

                const shouldShowEdit = !!col.editCell && (isHovered || isEditing);

                return (
                  <td
                    key={cell.id}
                    className={[shouldShowEdit ? styles.editing : '', col.className || ''].filter(Boolean).join(' ')}
                    onMouseEnter={() =>
                      setHoveredCell({
                        rowIndex: row.index,
                        columnId: cell.column.id,
                      })
                    }
                    onMouseLeave={() => setHoveredCell(null)}
                    onClick={() =>
                      col.editCell && setEditingCell({ rowIndex: row.index, columnId: cell.column.id })
                    }
                  >
                    {shouldShowEdit
                      ? <div
                          className={styles.cellEditor}
                          tabIndex={0}
                          onBlur={() => {
                            console.log('Updated row', row.index, cell.column.id, row);
                            setEditingCell(null);
                          }}
                          onKeyDown={(e: React.KeyboardEvent) => {
                            if (e.key === 'Enter') {
                              console.log('Updated row', row.index, cell.column.id, row);
                              setEditingCell(null);
                            }
                          }}
                        >
                          {col.editCell!({
                            getValue: cell.getValue,
                            row,
                            column: cell.column,
                            table,
                            setValue: (newVal: any) => (
                              table.options.meta?.updateCellValue?.(
                                row.index,
                                cell.column.id as keyof StagedTransaction,
                                newVal
                              )
                            )
                          })}
                        </div>
                      : flexRender(cell.column.columnDef.cell, cell.getContext())
                    }
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
