import { useState, useCallback } from 'react';
import { mutate } from 'swr';

import type { Category } from 'types/category';
import { CATEGORY_TREE_API_PATH, createCategory, updateCategory } from 'api/categories';
import { useAppContext } from 'contexts/app/AppContext';
import { patchTree } from 'utils/treeUtils';
import { stripCategoryRelations } from 'utils/categoryUtils';

export function useSaveCategory() {
  const { selectedUser } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const save = useCallback(async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    if (!selectedUser) {
      throw new Error('Cannot save category without a selected user');
    }

    const categoryTreeKey = `${selectedUser.id}_${CATEGORY_TREE_API_PATH}`;

    setLoading(true);
    setError(null);

    let rollbackTree: Category[] | undefined;

    // remove non-persisted fields
    const payload = stripCategoryRelations(category);

    try {
      // update state optimistically before calling api to persist
      mutate(
        categoryTreeKey,
        (current = []) => {
          rollbackTree = current;
          if (payload.id) {
            return patchTree<Category>(current, payload as Category & { id: string });
          } else {
            return current;
          }
        },
        { revalidate: false }
      );

      // call api
      let savedCategory: Category | null = null;
      if (category.id) {
        savedCategory = await updateCategory(payload as Category & { id: string});
      } else {
        savedCategory = await createCategory(payload);
      }
      
      // trigger background revalidation
      mutate(categoryTreeKey);

      return savedCategory;
    } catch (e) {
      // rollback optimistic change on error
      if (rollbackTree) {
        mutate(categoryTreeKey, rollbackTree, false);
      }
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [selectedUser]);

  return { save, loading, error };
};
