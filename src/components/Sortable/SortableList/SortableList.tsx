import React, { useEffect, useRef, useState } from 'react';
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
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

import type { FlattenedNode, TreeNode } from '../types';
import { flattenTree } from '../utils';

import DropIndicator from '../SortableTree/DropIndicator';
import SortableTreeNode from '../SortableTree/SortableTreeNode';

interface SortableListProps<T extends TreeNode> {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (node: T) => React.ReactNode;
}

const SortableList = <T extends TreeNode>({
  items,
  onChange,
  renderItem,
}: SortableListProps<T>) => {
  const [flattened, setFlattened] = useState<FlattenedNode<T>[]>(() => flattenTree(items, null, 0));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const pointerYRef = useRef<number>(0);
  const nodeRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    setFlattened(flattenTree(items, null, 0));
  }, [items]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 1 } }));

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
  };

  const handleDragMove = ({ active, over }: DragMoveEvent) => {
    pointerYRef.current = ((active.rect.current.translated?.top ?? 0) + active.rect.current.translated!.bottom) / 2;
    if (!over) { setDropIndex(null); return; }

    const overIndex = flattened.findIndex(f => f.id === over.id);
    if (overIndex === -1) { setDropIndex(null); return; }

    const overElement = nodeRefs.current.get(String(over.id));
    if (!overElement) { setDropIndex(null); return; }

    const rect = overElement.getBoundingClientRect();
    const isInUpperHalf = pointerYRef.current < rect.top + rect.height / 2;

    setDropIndex(isInUpperHalf ? overIndex : overIndex + 1);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      const oldIndex = flattened.findIndex(f => f.id === active.id);
      const newIndex = flattened.findIndex(f => f.id === over.id);
      onChange(arrayMove(items, oldIndex, newIndex));
    }
    setActiveId(null);
    setDropIndex(null);
  };

  const activeItem = flattened.find(f => f.id === activeId);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
      <SortableContext items={flattened.map(f => f.id)} strategy={verticalListSortingStrategy}>
        {flattened.map((f, index) => (
          <React.Fragment key={f.id}>
            {dropIndex === index && <DropIndicator depth={0} />}
            <SortableTreeNode node={f.node} depth={0} renderItem={renderItem} refMap={nodeRefs} />
          </React.Fragment>
        ))}
        {dropIndex === flattened.length && <DropIndicator depth={0} />}
      </SortableContext>

      <DragOverlay adjustScale={false}>
        {activeItem && (
          <div>{renderItem(activeItem.node)}</div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default SortableList;