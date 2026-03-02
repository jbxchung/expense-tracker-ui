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
