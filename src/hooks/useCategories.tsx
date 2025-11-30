
import { useMemo } from 'react';
import useSWR from 'swr';

import type { Category } from 'types/category';
import { CATEGORY_TREE_API_PATH, getCategoryTree } from 'api/categories';
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
