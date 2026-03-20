import type { Category } from 'types/category';

export function normalizeSortOrder(nodes: Category[]): Category[] {
  return nodes.map((node, index) => ({
    ...node,
    sortOrder: index,
    children: node.children ? normalizeSortOrder(node.children) : [],
  }));
}

// return a new blank, non-persisted category instance that will be saved upon edit
export function createTempCategory(parentId: string | null): Category {
  return {
    name: 'New Category',
    description: '',
    sortOrder: 0,
    transactionCount: 0,
    children: [],
    parentId,
    // these will get overwritten by backend when we save
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    excludeFromReports: false,
  };
}

export function insertCategory(
  tree: Category[],
  category: Category,
  parentId: string | null
): Category[] {
  if (parentId === null) {
    return [...tree, category];
  }

  return tree.map(node => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...(node.children ?? []), category],
      };
    }

    if (node.children?.length) {
      return {
        ...node,
        children: insertCategory(node.children, category, parentId),
      };
    }

    return node;
  });
}

// remove a category by its id
export function removeCategory(
  tree: Category[],
  categoryId: string,
): Category[] {
  return tree.filter(node => node.id !== categoryId).map(node => {
      if (!node.children?.length) {
        return node;
      }

      return {
        ...node,
        children: removeCategory(node.children, categoryId),
      };
    });
}