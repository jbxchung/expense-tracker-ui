import useSWR from 'swr';

import type { Category } from 'types/category';
import { CATEGORY_TREE_API_PATH, getCategories } from 'api/categories';
import { useUsers } from 'hooks/useUsers';

export const useCategoryTree = () => {
  // available accounts depends on the current user
  const { selectedUser, loading: usersLoading } = useUsers();

  const swrKey = selectedUser ? `${selectedUser}_${CATEGORY_TREE_API_PATH}` : null;
  const { data, error, mutate, isLoading: categoryTreeLoading } = useSWR<Category[], Error>(swrKey, getCategories);

  const isLoading = categoryTreeLoading || usersLoading;

  return {
    categoryTree: data ?? [],
    isLoading,
    error,
    refresh: mutate, // manual refresh
  };
};