import React from 'react';
import { useSortable } from '@dnd-kit/sortable';

import type { TreeNode } from '../types';

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
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({ id: node.id });

  const setRef = (el: HTMLElement | null) => {
    if (el) refMap.current.set(node.id, el);
    else refMap.current.delete(node.id);
    setNodeRef(el);
  };

  const style = { '--depth': depth } as React.CSSProperties;
  const cssClasses = [styles.treeNodeWrapper, isDragging ? styles.dragging : ''].filter(Boolean).join(' ');

  return (
    <div ref={setRef} style={style} className={cssClasses}>
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
