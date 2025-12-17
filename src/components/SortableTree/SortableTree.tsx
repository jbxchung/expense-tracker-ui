import React, { useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragMoveEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  flattenTree,
  rebuildTree,
  type TreeNode,
  type FlattenedNode,
} from './utils';

import styles from './SortableTree.module.scss';

/* --------------------------------------------------
 * Types
 * -------------------------------------------------- */

interface SortableTreeProps<T extends TreeNode> {
  items: T[];
  onChange: (newTree: T[]) => void;
  childrenOptions?: SortableTreeChildrenOptions;
  renderItem: (node: T) => React.ReactNode;
  indentWidth?: number;
}

interface SortableTreeChildrenOptions {
  key?: string;
  labels?: {
    singular: string;
    plural: string;
  };
}

type Projection = {
  parentId: string | null;
  index: number;
  depth: number;
};

/* --------------------------------------------------
 * Component
 * -------------------------------------------------- */

const SortableTree = <T extends TreeNode>({
  items,
  onChange,
  childrenOptions,
  renderItem,
  indentWidth = 24,
}: SortableTreeProps<T>) => {
  const {
    key: childrenKey = 'children',
    labels: childrenLabels = { singular: 'child', plural: 'children' }
  } = childrenOptions ?? {};

  const [flattened, setFlattened] = useState<FlattenedNode<T>[]>(() =>
    flattenTree(items, null, 0, childrenKey)
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragX, setDragX] = useState(0);
  const [projection, setProjection] = useState<Projection | null>(null);

  /* --------------------------------------------------
   * Sync external changes
   * -------------------------------------------------- */

  useEffect(() => {
    setFlattened(flattenTree(items, null, 0, childrenKey));
  }, [items, childrenKey]);

  /* --------------------------------------------------
   * Sensors
   * -------------------------------------------------- */

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  /* --------------------------------------------------
   * Drag lifecycle
   * -------------------------------------------------- */

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
  };

  // set horizontal drag distance for depth calculation
  const handleDragMove = ({ delta }: DragMoveEvent) => {
    setDragX(delta.x);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) {
      setProjection(null);
      return;
    }

    const activeIndex = flattened.findIndex(f => f.id === active.id);
    const overIndex = flattened.findIndex(f => f.id === over.id);

    if (activeIndex === -1 || overIndex === -1) return;

    const activeNode = flattened[activeIndex];
    const overNode = flattened[overIndex];

    // Calculate intended depth from horizontal drag
    let depth = overNode.depth + Math.round(dragX / indentWidth);
    depth = Math.max(0, depth);

    // Prevent dropping into own subtree
    for (let i = activeIndex + 1; i < flattened.length; i++) {
      if (flattened[i].depth <= activeNode.depth) break;
      if (flattened[i].id === overNode.id) {
        depth = activeNode.depth;
        break;
      }
    }

    setProjection({
      parentId:
        depth === 0
          ? null
          : depth > overNode.depth
          ? overNode.id
          : overNode.parentId ?? null,
      index: overIndex,
      depth,
    });
  };

  const handleDragEnd = ({ active }: DragEndEvent) => {
    if (!projection) {
      resetDrag();
      return;
    }

    const activeIndex = flattened.findIndex(f => f.id === active.id);
    if (activeIndex === -1) {
      resetDrag();
      return;
    }

    // extract subtree
    const subtree: FlattenedNode<T>[] = [];
    const rootDepth = flattened[activeIndex].depth;

    for (let i = activeIndex; i < flattened.length; i++) {
      if (flattened[i].depth < rootDepth) break;
      subtree.push({ ...flattened[i] });
    }

    const next = flattened.filter(f => !subtree.some(s => s.id === f.id));

    const depthDelta = projection.depth - subtree[0].depth;

    subtree.forEach(n => {
      n.depth += depthDelta;
      if (n.id === active.id) {
        n.parentId = projection.parentId;
      }
    });

    next.splice(projection.index, 0, ...subtree);

    setFlattened(next);
    onChange(rebuildTree(next));

    resetDrag();
  };

  const resetDrag = () => {
    setActiveId(null);
    setProjection(null);
    setDragX(0);
  };

  /* --------------------------------------------------
   * Drag overlay subtree
   * -------------------------------------------------- */

  // const draggedSubtree = useMemo(() => {
  //   if (!activeId) return [];

  //   const index = flattened.findIndex(f => f.id === activeId);
  //   if (index === -1) return [];

  //   const depth = flattened[index].depth;
  //   const result: FlattenedNode<T>[] = [];

  //   for (let i = index; i < flattened.length; i++) {
  //     if (flattened[i].depth < depth) break;
  //     result.push(flattened[i]);
  //   }

  //   return result;
  // }, [activeId, flattened]);
  const activeSummary = useMemo(() => {
    if (!activeId) return null;

    const index = flattened.findIndex(f => f.id === activeId);
    if (index === -1) return null;

    const parentDepth = flattened[index].depth;
    let count = 0;

    for (let i = index + 1; i < flattened.length; i++) {
      if (flattened[i].depth > parentDepth) {
        count++;
      } else break;
    }

    return {
      title: flattened[index].node.name,
      childrenCount: count,
    };
  }, [activeId, flattened]);

  /* --------------------------------------------------
   * Render helpers
   * -------------------------------------------------- */

  const renderNodes = () =>
    flattened.map((f, index) => (
      <React.Fragment key={f.id}>
        {projection?.index === index && (
          <div
            className={styles.dropIndicator}
            style={{ marginLeft: projection.depth * indentWidth }}
          />
        )}

        <SortableTreeNode<T>
          node={f.node}
          depth={f.depth}
          renderItem={renderItem}
        />
      </React.Fragment>
    ));

  const isDragging = activeId !== null;

  /* --------------------------------------------------
   * Render
   * -------------------------------------------------- */

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {isDragging ? (
        // 🔒 No SortableContext during drag → NO live sorting
        renderNodes()
      ) : (
        <SortableContext
          items={flattened.map(f => f.id)}
          strategy={verticalListSortingStrategy}
        >
          {renderNodes()}
        </SortableContext>
      )}

      <DragOverlay adjustScale={false}>
        {/* {activeId && (
          <div className={styles.dragOverlay}>
            {draggedSubtree.map(f => (
              <div key={f.id} style={{ paddingLeft: f.depth * indentWidth }}>
                {renderItem(f.node)}
              </div>
            ))}
          </div>
        )} */}
        {activeSummary && (
          <div className={styles.dragLabel}>
            <strong>{activeSummary.title}</strong>
            {activeSummary.childrenCount > 0 && (
              <span className={styles.dragMeta}>
                + {activeSummary.childrenCount} {activeSummary.childrenCount === 1 ? childrenLabels.singular : childrenLabels.plural}
              </span>
            )}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

/* --------------------------------------------------
 * Node
 * -------------------------------------------------- */

interface SortableTreeNodeProps<T extends TreeNode> {
  node: T;
  depth: number;
  renderItem: (node: T) => React.ReactNode;
}

const SortableTreeNode = <T extends TreeNode>({
  node,
  depth,
  renderItem,
  // activeId,
}: SortableTreeNodeProps<T>) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    paddingLeft: depth * 24,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.treeNodeWrapper}>
      <div {...attributes} className={styles.treeNode}>
        <div className={styles.content}>
          <span className={styles.handle} {...listeners}>≡</span>
          {renderItem(node)}
        </div>
        <div className={styles.actions}>
          + x{/* TODO: allow caller to pass in action buttons with full enabled/disabled states and custom handlers */}
        </div>
      </div>
    </div>
  );
};

export default SortableTree;