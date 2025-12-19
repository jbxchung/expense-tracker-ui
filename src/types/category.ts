import type { Tree } from 'types/tree';

// category object minus relations to user/parent/transactions
export interface Category extends Tree {
  id: string;
  name: string;
  description?: string;

  userId?: string;

  sortOrder: number;
  parentId?: string;
  children?: Category[];

  transactionCount: number;

  createdAt: Date;
  updatedAt: Date;
}
