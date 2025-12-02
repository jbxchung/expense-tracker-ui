
import { useCallback, useMemo, useState } from 'react';
import useSWR, { mutate } from 'swr';

import type { Category } from 'types/category';
import { CATEGORY_TREE_API_PATH, getCategoryTree, saveCategoryTree } from 'api/categories';
import { flattenTree } from 'utils/treeUtils';
import { useAppContext } from 'contexts/app/AppContext';

export const useCategoryTree = () => {
  // available accounts depends on the current user
  const { selectedUser, usersLoading } = useAppContext();

  // if the user isnt selected yet, swrKey will be null so swr won't try and fetch
  const swrKey = selectedUser ? `${selectedUser.id}_${CATEGORY_TREE_API_PATH}` : null;
  const { data, error, mutate, isLoading: categoryTreeLoading } = useSWR<Category[], Error>(swrKey, () => getCategoryTree(selectedUser!.id));

  const isLoading = categoryTreeLoading || usersLoading;

  return {
    categoryTree: data ?? [],
    isLoading,
    error,
    refresh: mutate, // manual refresh
  };
};

export const useCategoryList = () => {
  const { categoryTree, isLoading, error, refresh } = useCategoryTree();

  // Memoize so we don't recompute on every render
  const categories = useMemo(() => {
    if (!categoryTree) return [];
    return flattenTree<Category>(categoryTree);
  }, [categoryTree]);

  return { categories, isLoading, error, refresh };
};

export function useSaveCategoryTree() {
  const { selectedUser } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const saveTree = useCallback(
    async (tree: Category[]) => {
      if (!selectedUser) {
        throw new Error('Cannot save category tree without a selected user');
      }

      const cacheKey = `${selectedUser.id}_${CATEGORY_TREE_API_PATH}`;
      setLoading(true);
      setError(null);

      // take a snapshot of the current cache in case we need to rollback
      const snapshot = mutate(cacheKey, (current = []) => current, false);

      try {
        // optimistically update the cache
        mutate(cacheKey, tree, false);

        // call API to persist the full tree
        await saveCategoryTree(selectedUser.id, tree);

        // revalidate the cache in the background
        mutate(cacheKey);
      } catch (e) {
        // rollback on error
        mutate(cacheKey, snapshot, false);
        setError(e as Error);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [selectedUser]
  );

  return { saveTree, loading, error };
}
