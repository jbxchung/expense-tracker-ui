import type { Tree } from 'types/tree';

// flatten a nested structure
export function flattenTree<T extends Tree> (
  nodes: Array<T & { [key: string]: any }>,
  childrenKey: string = 'children',
  depth = 0,
  ancestorIds: string[] = [],
): Array<T & { depth: number; ancestorIds: string[]; descendantIds: string[] }> {
  const result: Array<T & { depth: number; ancestorIds: string[], descendantIds: string[] }> = [];

  for (const item of nodes) {
    const { [childrenKey]: children, ...nodeWithoutChildren } = item;
    const entry = {
      ...(nodeWithoutChildren as T),
      depth,
      ancestorIds,
      descendantIds: [] as string[],
    };
    result.push(entry);

    if (children && Array.isArray(children) && children.length > 0) {
      const childResults = flattenTree(children, childrenKey, depth + 1, [...ancestorIds, item.id]);
      entry.descendantIds = childResults.map(child => child.id);
      result.push(...childResults);
    }
  }

  return result;
}

// update a node in-place
export function patchTree<T extends Tree>(
  tree: T[],
  updatedNode: T,
  childrenKey: keyof T = 'children'
): T[] {
  return tree.map(node => {
    // merge updated properties but keep children as-is
    if (node.id === updatedNode.id) {
      const { [childrenKey]: _, ...restUpdated } = updatedNode;
      return { ...node, ...restUpdated } as T;
    }

    const childNodes = node[childrenKey];
    if (Array.isArray(childNodes) && childNodes.length > 0) {
      return {
        ...node,
        [childrenKey]: patchTree(childNodes, updatedNode, childrenKey),
      } as T;
    }

    return node;
  });
}
