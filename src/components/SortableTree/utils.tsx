export interface TreeNode {
  id: string;
  children?: TreeNode[];
  [key: string]: any;
}

export interface FlattenedNode<T> {
  id: string;
  parentId: string | null;
  depth: number;
  node: T;
  index: number;
}

export function flattenTree<T extends TreeNode>(nodes: T[], parentId: string | null = null, depth = 0, childrenKey: keyof T = 'children'): FlattenedNode<T>[] {
  let flat: FlattenedNode<T>[] = [];
  nodes.forEach((node, index) => {
    flat.push({ id: node.id, parentId, depth, node, index });
    if (node[childrenKey]?.length) {
      flat = flat.concat(flattenTree(node[childrenKey]!, node.id, depth + 1));
    }
  });
  return flat;
}

export function rebuildTree<T extends TreeNode>(flat: FlattenedNode<T>[], childrenKey: keyof T = 'children'): T[] {
  const idMap = new Map<string, T & { [childrenKey: string]: T[] }>();
  flat.forEach(f => {
    idMap.set(f.id, { ...f.node, [childrenKey]: [] });
  });
  const tree: T[] = [];
  flat.forEach(f => {
    const item = idMap.get(f.id)!;
    if (f.parentId) {
      const parent = idMap.get(f.parentId)!;
      parent[childrenKey].push(item);
    } else {
      tree.push(item);
    }
  });
  return tree;
}

// utility to get which indices of our SortableTree's data are valid for the active node to be dropped at
export function getValidDropIndices<T extends TreeNode>(
  flattened: FlattenedNode<T>[],
  activeId: string
): Set<number> {
  const activeIndex = flattened.findIndex(f => f.id === activeId);
  if (activeIndex === -1) return new Set();

  const activeNode = flattened[activeIndex];

  // collect subtree of active node
  const subtreeIds = new Set<string>();
  for (let i = activeIndex; i < flattened.length; i++) {
    const node = flattened[i];
    if (i !== activeIndex && node.depth <= activeNode.depth) break;
    subtreeIds.add(node.id);
  }

  const validIndices = new Set<number>();

  // every index in flattened array except inside its own subtree is valid
  for (let i = 0; i <= flattened.length; i++) {
    // check if inserting here would place any node inside its own subtree
    const prevNode = flattened[i - 1];
    const nextNode = flattened[i];

    const prevId = prevNode?.id;
    const nextId = nextNode?.id;

    // cannot insert before or after a node in own subtree
    if ((prevId && subtreeIds.has(prevId)) || (nextId && subtreeIds.has(nextId))) continue;

    validIndices.add(i);
  }

  return validIndices;
}