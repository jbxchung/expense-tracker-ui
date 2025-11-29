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
