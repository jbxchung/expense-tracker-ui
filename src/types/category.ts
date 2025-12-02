// types/category.ts
import type { Transaction } from './transaction';
import type { User } from './user';

// todo - may not need all these fields for frontend
export interface Category {
  id: string;
  name: string;
  description?: string;

  userId?: string;
  user?: User;

  parentId?: string;
  parent?: Category
  children?: Category[];

  transactions?: Transaction[];

  createdAt: Date;
  updatedAt: Date;
}
