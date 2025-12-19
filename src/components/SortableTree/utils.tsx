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

// utility type for projected indicator position
export type Projection = {
  parentId: string | null;
  index: number;
  depth: number;
};

// utility type for drag context
export type DragContext = {
  activeIndex: number;
  activeDepth: number;
  subtreeEnd: number;
}

// utlity types for drop position tracking
export type DropPosition = {
  depth: number;
  index: number;
}
export type ValidDropPositions = Map<DropPosition['depth'], Set<DropPosition['index']>>;

// tree utilities
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

// drag and drop validation
export function isValidDrop(
  ctx: DragContext,
  targetIndex: number,
  targetDepth: number,
): boolean {
  const {
    activeIndex,
    activeDepth,
    subtreeEnd,
  } = ctx;

  const subtreeSize = subtreeEnd - activeIndex;

  // normalize index as if subtree were removed first
  const normalizedIndex = targetIndex > activeIndex ? targetIndex - subtreeSize : targetIndex;

  // TODO - revisit ownsubtree condition for edge case where a last child cannot be moved out to before its parent's next sibling
  // low priority since it is an easy workaround to just drag it somewhere else first
  const inOwnSubtree = targetIndex > activeIndex && targetIndex <= subtreeEnd;
  const inSamePosition = normalizedIndex === activeIndex && targetDepth === activeDepth;
  const selfAsChild = targetIndex === activeIndex + 1 && targetDepth === activeDepth + 1;

  return !inOwnSubtree && !inSamePosition && !selfAsChild;
}
