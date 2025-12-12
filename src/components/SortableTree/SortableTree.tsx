import React, { useEffect, useState } from 'react';
import {
  DndContext,
  rectIntersection,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragMoveEvent,
  type DragEndEvent,
  type CollisionDetection,
  type Collision,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { flattenTree, rebuildTree, type TreeNode, type FlattenedNode } from './utils';
import styles from './SortableTree.module.scss';

interface SortableTreeProps<T extends TreeNode> {
  items: T[];
  onChange: (newTree: T[]) => void;
  childrenKey?: string;
  renderItem: (node: T) => React.ReactNode;
  indentWidth?: number; // pixels per depth level
}

const SortableTree = <T extends TreeNode>({
  items,
  onChange,
  childrenKey = 'children',
  renderItem,
  indentWidth = 24,
}: SortableTreeProps<T>) => {
  const [flattened, setFlattened] = useState<FlattenedNode<T>[]>(() =>
    flattenTree(items, null, 0, childrenKey)
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragX, setDragX] = useState<number>(0);

  useEffect(() => {
    setFlattened(flattenTree(items, null, 0, childrenKey));
  }, [items, childrenKey]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
  };

  const handleDragMove = ({ delta }: DragMoveEvent) => {
    // track horizontal drag to adjust depth
    setDragX(delta.x);
  };

  // this is the main logic for reordering and changing depth
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) {
      setActiveId(null);
      setDragX(0);
      return;
    }

    const newFlattened = [...flattened];
    const activeIndex = newFlattened.findIndex(f => f.id === active.id);
    const overIndex = newFlattened.findIndex(f => f.id === over.id);

    if (activeIndex === -1 || overIndex === -1) {
      setActiveId(null);
      setDragX(0);
      return;
    }

    // Extract the subtree
    const movedNode = newFlattened[activeIndex];
    const subtree: FlattenedNode<T>[] = [movedNode];
    for (let i = activeIndex + 1; i < newFlattened.length; i++) {
      if (newFlattened[i].depth > movedNode.depth) {
        subtree.push(newFlattened[i]);
      } else break;
    }

    // Remove subtree from flattened
    newFlattened.splice(activeIndex, subtree.length);

    // Determine new depth
    const overNode = newFlattened[overIndex];
    let newDepth = overNode.depth + Math.round(dragX / indentWidth);
    if (newDepth < 0) newDepth = 0;

    // Prevent dropping into its own subtree
    if (subtree.some(f => f.id === overNode.id)) {
      newDepth = movedNode.depth;
    }

    // Set new parentId
    if (newDepth === 0) {
      movedNode.parentId = null;
    } else if (newDepth > overNode.depth) {
      movedNode.parentId = overNode.node.id;
    } else {
      movedNode.parentId = overNode.parentId ?? null;
    }

    // Adjust subtree depths
    const depthOffset = newDepth - movedNode.depth;
    subtree.forEach(n => {
      n.depth += depthOffset;
    });

    // Insert subtree at overIndex
    newFlattened.splice(overIndex, 0, ...subtree);

    setFlattened(newFlattened);
    onChange(rebuildTree(newFlattened));
    setActiveId(null);
    setDragX(0);
  };

  // collision detection for nested tree
  const nestedCollision: CollisionDetection = (args): Collision[] => {
    const { active, droppableContainers, droppableRects } = args;
    if (!droppableContainers || droppableRects.size === 0) return [];

    const containersArray = Array.from(droppableContainers.values());

    const collisions = rectIntersection({ ...args, droppableContainers: containersArray });
    if (!collisions || collisions.length === 0) return [];

    const activeRect = active.rect.current.translated;
    if (!activeRect) return [];

    const sorted = collisions.sort((a, b) => {
      const aRect = droppableRects.get(a.id);
      const bRect = droppableRects.get(b.id);

      if (!aRect || !bRect) return 0;

      const aCenter = (aRect.top + aRect.bottom) / 2;
      const bCenter = (bRect.top + bRect.bottom) / 2;
      const activeCenter = (activeRect.top + activeRect.bottom) / 2;

      return Math.abs(aCenter - activeCenter) - Math.abs(bCenter - activeCenter);
    });

    return [sorted[0]];
  };

  // Get subtree for drag overlay
  const getSubtree = (parentId: string): FlattenedNode<T>[] => {
    const index = flattened.findIndex(f => f.id === parentId);
    if (index === -1) return [];
    const parentDepth = flattened[index].depth;
    const subtree: FlattenedNode<T>[] = [flattened[index]];

    for (let i = index + 1; i < flattened.length; i++) {
      if (flattened[i].depth > parentDepth) {
        subtree.push(flattened[i]);
      } else break;
    }
    return subtree;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={nestedCollision}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={flattened.map(f => f.id)}
        strategy={verticalListSortingStrategy}
      >
        {flattened.map(f => (
          <SortableTreeNode<T>
            key={f.id}
            node={f.node}
            depth={f.depth}
            renderItem={renderItem}
          />
        ))}
      </SortableContext>

      <DragOverlay>
        {activeId && (
          <div className={styles.dragOverlay}>
            {getSubtree(activeId).map(f => (
              <div key={f.id} style={{ paddingLeft: f.depth * indentWidth }}>
                {renderItem(f.node)}
              </div>
            ))}
            {/* {renderItem(flattened.find(f => f.id === activeId)!.node)} */}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

interface SortableTreeNodeProps<T extends TreeNode> {
  node: T;
  depth: number;
  renderItem: (node: T) => React.ReactNode;
}

const SortableTreeNode = <T extends TreeNode>({
  node,
  depth,
  renderItem,
}: SortableTreeNodeProps<T>) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: node.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    '--depth': depth,
  } as React.CSSProperties;

  return (
    <div ref={setNodeRef} style={style} className={styles.treeNode}>
      <div {...attributes} className={styles.treeNodeContent}>
        {renderItem(node)}
        <span className={styles.handle} {...listeners}>≡</span>
      </div>
    </div>
  );
};

export default SortableTree;
