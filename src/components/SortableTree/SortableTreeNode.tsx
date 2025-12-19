import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { TreeNode } from './utils';

import styles from './SortableTree.module.scss';

interface SortableTreeNodeProps<T extends TreeNode> {
  node: T;
  depth: number;
  renderItem: (node: T) => React.ReactNode;
  refMap: React.RefObject<Map<string, HTMLElement>>;
}

const SortableTreeNode = <T extends TreeNode>({
  node,
  depth,
  renderItem,
  refMap,
}: SortableTreeNodeProps<T>) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: node.id });

  const setRef = (el: HTMLElement | null) => {
    if (el) refMap.current.set(node.id, el);
    else refMap.current.delete(node.id);
    setNodeRef(el);
  };

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    paddingLeft: depth * 24,
  };

  return (
    <div ref={setRef} style={style} className={styles.treeNodeWrapper}>
      <div {...attributes} className={styles.treeNode}>
        <div className={styles.content}>
          <span className={styles.handle} {...listeners}>≡</span>
          {renderItem(node)}
        </div>
      </div>
    </div>
  );
};

export default SortableTreeNode;
