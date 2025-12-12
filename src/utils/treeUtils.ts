interface Tree {
  id: string;
  children?: Tree[];
}

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
export function patchTree<T extends Tree>(
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
