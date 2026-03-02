import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragMoveEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import type {
  DragContext,
  FlattenedNode,
  Projection,
  TreeNode,
} from '../types';
import {
  flattenTree,
  rebuildTree,
  isValidDrop,
} from '../utils';

import DropIndicator from './DropIndicator';
import SortableTreeNode from './SortableTreeNode';

import styles from './SortableTree.module.scss';

interface SortableTreeProps<T extends TreeNode> {
  items: T[];
  onChange: (newTree: T[]) => void;
  childrenOptions?: {
    key?: string;
    labels?: { singular: string; plural: string };
  };
  renderItem: (node: T) => React.ReactNode;
  edgeThreshold?: number; // proportion of node height for edge drop zones
}

const SortableTree = <T extends TreeNode>({
  items,
  onChange,
  childrenOptions,
  renderItem,
  edgeThreshold = 0.25,
}: SortableTreeProps<T>) => {
  const {
    key: childrenKey = 'children',
    labels: childrenLabels = { singular: 'child', plural: 'children' },
  } = childrenOptions ?? {};

  const [flattened, setFlattened] = useState<FlattenedNode<T>[]>(() => flattenTree(items, null, 0, childrenKey));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [projection, setProjection] = useState<Projection | null>(null);

  // on drag start, get info for the currently dragging subtree
  const dragContextRef = useRef<DragContext | null>(null);
  // keep current y position of pointer during drag to compare with row bounding rects
  const pointerYRef = useRef<number>(0);
  // keep refs for each row so we can get the HtmlElement bounding rect during drag
  const nodeRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    setFlattened(flattenTree(items, null, 0, childrenKey));
  }, [items, childrenKey]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 1 },
    }));

  const handleDragStart = ({ active }: DragStartEvent) => {
    // get currently dragged subtree
    const activeIndex = flattened.findIndex(f => f.id === active.id);
    if (activeIndex === -1) return;

    const activeDepth = flattened[activeIndex].depth;

    let subtreeEnd = activeIndex + 1;
    while (subtreeEnd < flattened.length && flattened[subtreeEnd].depth > activeDepth) {
      subtreeEnd++;
    }

    dragContextRef.current = {
      activeIndex,
      activeDepth,
      subtreeEnd,
    };

    // track currently dragging item
    setActiveId(active.id as string);
  };

  // track pointer Y position during drag
  const handleDragMove = ({ active, over }: DragMoveEvent) => {
    pointerYRef.current = ((active.rect.current.translated?.top ?? 0) + active.rect.current.translated!.bottom) / 2;
    if (!over || !activeId) {
      setProjection(null);
      return;
    }

    const activeIndex = dragContextRef.current?.activeIndex ?? -1;
    const overIndex = flattened.findIndex(f => f.id === over.id);
    if (activeIndex === -1 || overIndex === -1) return;

    const overElement = nodeRefs.current.get(String(over.id));
    if (!overElement) return;

    const rect = overElement.getBoundingClientRect();
    const pointerY = pointerYRef.current;
    const ratio = Math.abs((pointerY - rect.top) / rect.height);
    
    // same depth and index, no change
    if (activeIndex === overIndex) {
      setProjection(null);
      return;
    }

    let targetParentId: string | null = null;
    let targetDepth = null;
    let targetIndex = null;

    if (ratio < edgeThreshold) {
      // before
      targetParentId = flattened[overIndex].parentId;
      targetDepth = flattened[overIndex].depth;
      targetIndex = overIndex;
    } else if (ratio > 1 - edgeThreshold) {
      // after
      targetParentId = flattened[overIndex].parentId;
      targetDepth = flattened[overIndex].depth;
      targetIndex = overIndex + 1;
    } else {
      // inside
      targetParentId = flattened[overIndex].node.id;
      targetDepth = flattened[overIndex].depth + 1;
      targetIndex = overIndex + 1;
    }

    const ctx = dragContextRef.current;
    if (!ctx) return;

    if (isValidDrop(ctx, targetIndex, targetDepth)) {
      setProjection({ parentId: targetParentId, index: targetIndex, depth: targetDepth });
    } else {
      // invalid drop position, do not show preview
      setProjection(null);
    }
  };

  const handleDragEnd = ({ active }: DragEndEvent) => {
    const ctx = dragContextRef.current;
    if (!projection || !ctx) {
      resetDrag();
      return;
    }

    const activeIndex = ctx.activeIndex;
    const rootDepth = flattened[activeIndex].depth;

    // extract subtree and remove it from flattened list
    const subtree: FlattenedNode<T>[] = [];
    for (let i = activeIndex; i < ctx.subtreeEnd; i++) {
      subtree.push({ ...flattened[i] });
    }
    const next = flattened.filter(f => !subtree.some(s => s.id === f.id));

    // normalize insertion index
    const subtreeSize = subtree.length;
    const insertionIndex = projection.index > activeIndex ? projection.index - subtreeSize : projection.index;

    // compute new depth
    const parentNode = flattened.find(f => f.node.id === projection.parentId);
    const newDepth = parentNode ? parentNode.depth + 1 : 0;

    // reparent + redepth subtree
    subtree.forEach(n => {
      if (n.id === active.id) {
        n.parentId = projection.parentId;
      }
      n.depth = n.depth - rootDepth + newDepth;
    });

    // insert subtree into next flattened list and update state
    next.splice(insertionIndex, 0, ...subtree);

    setFlattened(next);
    onChange(rebuildTree(next));
    resetDrag();
  };


  const resetDrag = () => {
    setActiveId(null);
    setProjection(null);
    pointerYRef.current = 0;
  };

  // helper object for display info in drag overlay
  const dragOverlayMeta = useMemo(() => {
    if (!activeId) return null;

    const index = flattened.findIndex(f => f.id === activeId);
    if (index === -1) return null;

    // count children
    const parentDepth = flattened[index].depth;
    let count = 0;
    for (let i = index + 1; i < flattened.length; i++) {
      if (flattened[i].depth > parentDepth) count++;
      else break;
    }

    // build projected parent path (if any)
    let parentPath: string[] | null = null;

    if (projection?.parentId) {
      parentPath = [];
      let currentId: string | null = projection.parentId;

      while (currentId) {
        const node = flattened.find(f => f.id === currentId);
        if (!node) break;

        parentPath.push(node.node.name);
        currentId = node.parentId;
      }

      parentPath.reverse();
    }

    const currentParentId = flattened[index].parentId;
    const targetParentId = projection?.parentId ?? currentParentId;

    return { title: flattened[index].node.name, childrenCount: count, parentPath, isSameParent: currentParentId === targetParentId };
  }, [activeId, flattened, projection?.parentId]);

  const renderNodes = () => {
    const nodes = flattened.map((f, index) => (
      <React.Fragment key={f.id}>
        {projection?.index === index && (
          <DropIndicator depth={projection.depth} />
        )}
        <SortableTreeNode
          node={f.node}
          depth={f.depth}
          renderItem={renderItem}
          refMap={nodeRefs}
        />
      </React.Fragment>
    ));

    // if projection is at the end, render drop indicator
    if (projection?.index === flattened.length) {
      nodes.push(<DropIndicator depth={projection.depth} />);
    }

    return nodes;
  };

  const isDragging = activeId !== null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      {isDragging ? renderNodes() : (
        <SortableContext items={flattened.map(f => f.id)} strategy={verticalListSortingStrategy}>
          {renderNodes()}
        </SortableContext>
      )}

      <DragOverlay adjustScale={false}>
        {dragOverlayMeta && (
          <div className={styles.dragOverlay}>
            <span>Move </span>
            <span className={styles.dragTitle}>{dragOverlayMeta.title}</span>
            {dragOverlayMeta.childrenCount > 0 && (
              <span className={styles.dragMeta}>
                {` +${dragOverlayMeta.childrenCount} ${dragOverlayMeta.childrenCount === 1 ? childrenLabels.singular : childrenLabels.plural}`}
              </span>
            )}
            {dragOverlayMeta.parentPath && !dragOverlayMeta.isSameParent && (
              <span>
                {` to ${dragOverlayMeta.parentPath.join(' / ')}`}
              </span>
            )}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default SortableTree;
