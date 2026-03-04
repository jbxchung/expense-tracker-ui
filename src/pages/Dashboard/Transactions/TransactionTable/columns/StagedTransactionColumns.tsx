import type { EditableColumnDef } from 'types/table';
import type { StagedTransaction } from 'types/transaction';

import { dateColumn, amountColumn, descriptionColumn, originalDescriptionColumn, categoryColumn } from './base';

export const StagedTransactionColumns: EditableColumnDef<StagedTransaction>[] = [
  dateColumn<StagedTransaction>(),
  amountColumn<StagedTransaction>(),
  categoryColumn<StagedTransaction>(),
  descriptionColumn<StagedTransaction>(),
  originalDescriptionColumn<StagedTransaction>(),
];
