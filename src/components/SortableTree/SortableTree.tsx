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
  type DragOverEvent,
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
  getValidDropIndices,
} from './utils';

import styles from './SortableTree.module.scss';

interface SortableTreeProps<T extends TreeNode> {
  items: T[];
  onChange: (newTree: T[]) => void;
  childrenOptions?: {
    key?: string;
    labels?: { singular: string; plural: string };
  };
  renderItem: (node: T) => React.ReactNode;
  indentWidth?: number;
}

type Projection = {
  parentId: string | null;
  index: number;
};

const SortableTree = <T extends TreeNode>({
  items,
  onChange,
  childrenOptions,
  renderItem,
  indentWidth = 24,
}: SortableTreeProps<T>) => {
  const {
    key: childrenKey = 'children',
    labels: childrenLabels = { singular: 'child', plural: 'children' },
  } = childrenOptions ?? {};

  const [flattened, setFlattened] = useState<FlattenedNode<T>[]>(
    () => flattenTree(items, null, 0, childrenKey)
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [projection, setProjection] = useState<Projection | null>(null);

  // on drag start, keep track of valid drop indices for active node
  const validDropIndicesRef = useRef<Set<number>>(new Set());
  // keep current y position of pointer during drag
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
    setActiveId(active.id as string);
    validDropIndicesRef.current = getValidDropIndices(flattened, active.id as string);
  };

  // track pointer Y position during drag
  const handleDragMove = ({ active, over }: DragMoveEvent) => {
    pointerYRef.current = ((active.rect.current.translated?.top ?? 0) + active.rect.current.translated!.bottom) / 2;
    if (!over || !activeId) {
      setProjection(null);
      return;
    }

    const activeIndex = flattened.findIndex(f => f.id === activeId);
    const overIndex = flattened.findIndex(f => f.id === over.id);
    if (activeIndex === -1 || overIndex === -1) return;

    const overElement = nodeRefs.current.get(String(over.id));
    if (!overElement) return;

    // skip if over self
    // if (activeIndex === overIndex) {
    //   setProjection(null);
    //   return;
    // }

    const rect = overElement.getBoundingClientRect();
    const pointerY = pointerYRef.current;
    const ratio = Math.abs((pointerY - rect.top) / rect.height);
    
    // console.log(`pointerY: ${pointerY}, rect.top: ${rect.top}, rect.height: ${rect.height}, rect.bottom: ${rect.bottom}, ratio: ${ratio.toFixed(2)}`);

    let targetParentId: string | null = flattened[overIndex].parentId;
    let targetIndex = overIndex;

    if (ratio < 0.3) {
      // before
      targetParentId = flattened[overIndex].parentId;
      targetIndex = overIndex;
    } else if (ratio > 0.7) {
      // after
      targetParentId = flattened[overIndex].parentId;
      targetIndex = overIndex + 1;
    } else {
      // inside
      targetParentId = flattened[overIndex].node.id;
      targetIndex = overIndex + 1; // first child because parentId is set
    }

    if (validDropIndicesRef.current.has(targetIndex)) {
      setProjection({ parentId: targetParentId, index: targetIndex });
    } else {
      // invalid, do not show preview
      setProjection(null);
    }
  };

  const handleDragOver = ({ over }: DragOverEvent) => {
    const activeIndex = flattened.findIndex(f => f.id === activeId);
    const overIndex = flattened.findIndex(f => f.id === over!.id);
    console.log(`dragging ${flattened[activeIndex].node.name} over ${flattened[overIndex].node.name}`);
  }

  const handleDragEnd = ({ active }: DragEndEvent) => {
    if (!projection) {
      resetDrag();
      return;
    }

    const activeIndex = flattened.findIndex(f => f.id === active.id);
    if (activeIndex === -1) return resetDrag();

    // extract subtree
    const subtree: FlattenedNode<T>[] = [];
    const rootDepth = flattened[activeIndex].depth;
    for (let i = activeIndex; i < flattened.length; i++) {
      if (flattened[i].depth < rootDepth) break;
      subtree.push({ ...flattened[i] });
    }

    const next = flattened.filter(f => !subtree.some(s => s.id === f.id));

    const parentId = projection.parentId;
    const parentNode = flattened.find(f => f.node.id === parentId);
    const depth = parentNode ? parentNode.depth + 1 : 0;

    subtree.forEach(n => {
      n.parentId = n.id === active.id ? parentId : n.parentId;
      n.depth = n.depth - rootDepth + depth;
    });

    next.splice(projection.index, 0, ...subtree);
    setFlattened(next);
    onChange(rebuildTree(next));

    resetDrag();
  };

  const resetDrag = () => {
    setActiveId(null);
    setProjection(null);
    pointerYRef.current = 0;
  };

  const dragOverlayContent = useMemo(() => {
    if (!activeId) return null;

    const index = flattened.findIndex(f => f.id === activeId);
    if (index === -1) return null;

    const parentDepth = flattened[index].depth;
    let count = 0;
    for (let i = index + 1; i < flattened.length; i++) {
      if (flattened[i].depth > parentDepth) count++;
      else break;
    }

    return { title: flattened[index].node.name, childrenCount: count };
  }, [activeId, flattened]);

  const renderNodes = () =>
    flattened.map((f, index) => (
      <React.Fragment key={f.id}>
        {projection?.index === index && (
          <div
            className={styles.dropIndicator}
            style={{ marginLeft: (flattened[index].depth ?? 0) * indentWidth }}
          />
        )}
        <SortableTreeNode
          node={f.node}
          depth={f.depth}
          renderItem={renderItem}
          refMap={nodeRefs}
        />
      </React.Fragment>
    ));

  const isDragging = activeId !== null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {isDragging ? renderNodes() : (
        <SortableContext items={flattened.map(f => f.id)} strategy={verticalListSortingStrategy}>
          {renderNodes()}
        </SortableContext>
      )}

      <DragOverlay adjustScale={false}>
        {dragOverlayContent && (
          <div className={styles.dragLabel}>
            <strong>{dragOverlayContent.title}</strong>
            {dragOverlayContent.childrenCount > 0 && (
              <span className={styles.dragMeta}>
                + {dragOverlayContent.childrenCount} {dragOverlayContent.childrenCount === 1 ? childrenLabels.singular : childrenLabels.plural}
              </span>
            )}
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

export default SortableTree;
