import type { Tree } from 'types/tree';

// category object minus relations to user/parent/transactions
export interface Category extends Tree {
  id: string;
  name: string;
  description?: string;

  userId?: string;

  sortOrder: number;
  parentId: string | null;
  children?: Category[];

  transactionCount: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface FlattenedCategory extends Category {
  depth: number;
  ancestorIds: string[];
  descendantIds: string[];
}

// sentinel value for category filter
export const UNKNOWN_CATEGORY = '__UNKNOWN__';
