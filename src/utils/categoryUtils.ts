import type { Category } from 'types/category';

export function normalizeSortOrder(nodes: Category[]): Category[] {
  return nodes.map((node, index) => ({
    ...node,
    sortOrder: index,
    children: node.children ? normalizeSortOrder(node.children) : [],
  }));
}
