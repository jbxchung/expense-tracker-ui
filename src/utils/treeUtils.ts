// flatten a nested structure
export function flattenTree<T> (
  nodes: Array<T & { [key: string]: any }>,
  childrenKey: string = 'children'
): T[] {
  const result: T[] = [];

  function recurse(items: Array<T & { [key: string]: any }>) {
    for (const item of items) {
      const { [childrenKey]: children, ...nodeWithoutChildren } = item;
      result.push(nodeWithoutChildren as T);

      if (children && Array.isArray(children) && children.length > 0) {
        recurse(children);
      }
    }
  }

  recurse(nodes);
  return result;
}

// update a node in-place
export function patchTree<T extends { id: string; children?: T[] }>(
  tree: T[],
  updatedNode: T,
  childrenKey: keyof T = 'children'
): T[] {
  return tree.map(node => {
    // merge updated properties but keep children as-is
    if (node.id === updatedNode.id) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [childrenKey]: _, ...restUpdated } = updatedNode;
      return { ...node, ...restUpdated } as T;
    }

    const childNodes = node[childrenKey];
    if (Array.isArray(childNodes) && childNodes.length > 0) {
      return {
        ...node,
        [childrenKey]: patchTree(childNodes, updatedNode, childrenKey),
      } as T;
    }

    return node;
  });
}

// move a node to a new parent
export function moveNode<T extends { [key: string]: any }>(
  nodes: Array<T>,
  nodeId: string,
  newParentId: string | null,
  childrenKey: string = 'children'
): T[] {
  let movingNode: T | null = null;

  const removeNode = (items: T[]): T[] => {
    return items
      .map(node => {
        if (node.id === nodeId) {
          movingNode = { ...node, [childrenKey]: node[childrenKey] ?? [] };
          return null;
        }

        const children = node[childrenKey];
        if (children && Array.isArray(children) && children.length > 0) {
          return { ...node, [childrenKey]: removeNode(children).filter(Boolean) as T[] };
        }

        return node;
      })
      .filter(Boolean) as T[];
  };

  const insertNode = (items: T[]): T[] => {
    return items.map(node => {
      if (node.id === newParentId) {
        return { ...node, [childrenKey]: [...(node[childrenKey] ?? []), movingNode!] };
      }

      const children = node[childrenKey];
      if (children && Array.isArray(children) && children.length > 0) {
        return { ...node, [childrenKey]: insertNode(children) };
      }

      return node;
    });
  };

  let newTree = removeNode(nodes);

  if (!movingNode) {
    console.warn(`moveNode: nodeId ${nodeId} not found`);
    return nodes;
  }

  if (newParentId === null) {
    newTree.push(movingNode);
  } else {
    newTree = insertNode(newTree);
  }

  return newTree;
}
