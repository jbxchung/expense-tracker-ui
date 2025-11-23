import type { Category } from './category';

export type Transaction = {
  id: string;
  amount: number;
  date: Date;
  accountId: string;
  categoryId?: string;
  category?: Category;
  description?: string;
  originalDescription?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type StagedTransaction = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;

// runtime template object so we can iterate over keys
export const stagedTransactionTemplate: Record<keyof StagedTransaction, any> = {
  amount: {
    title: 'Amount',
    type: typeof Number,
  },
  date: {
    title: 'Date',
    type: typeof Date,
  },
  accountId: {
    visible: false,
    title: 'Account ID',
    type: typeof String,
  },
  categoryId: {
    visible: false,
    title: 'Category ID',
    type: typeof String,
  },
  category: {
    title: 'Category',
    type: typeof Object,
  },
  description: {
    title: 'Description',
    type: typeof String,
  },
  originalDescription: {
    title: 'Original Description',
    type: typeof String,
  },
};

export const stagedTransactionKeys = Object.keys(stagedTransactionTemplate) as Array<keyof StagedTransaction>;