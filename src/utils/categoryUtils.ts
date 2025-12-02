import type { Category } from 'types/category';

export function stripCategoryRelations(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Omit<Category, 'id' | 'children' | 'parent' | 'transactions' | 'createdAt' | 'updatedAt'> & { id?: string} {
  const { children, parent, transactions, ...clean } = category;
  // for eslint
  void children;
  void parent;
  void transactions;

  return clean;
}
