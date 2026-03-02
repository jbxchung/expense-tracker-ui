import { useCallback, useEffect, useState, type FC } from 'react';

import type { Category } from 'types/category';
import { useCategoryTree, useSaveCategoryTree } from 'hooks/categories/useCategories';
import { patchTree } from 'utils/treeUtils';

import Card from 'components/Card/Card';
import SortableTree from 'components/Sortable/SortableTree/SortableTree';

import { createTempCategory, insertCategory, normalizeSortOrder, removeCategory } from 'utils/categoryUtils';

import styles from './Categories.module.scss';
import CategoryItem from './CategoryItem';

const Categories: FC = () => {
  const { categoryTree, isLoading, error } = useCategoryTree();
  const { saveTree, /*loading: saving*/ } = useSaveCategoryTree();

  // local state holds the editable tree
  const [tree, setTree] = useState<Category[]>(categoryTree);
  
  // reset editableCategoryTree on fetch API completion
  useEffect(() => {
    if (categoryTree?.length) {
      setTree(categoryTree);
    }
  }, [categoryTree]);

  // update a category in the tree
  const handleEdit = useCallback((updatedCategory: Category) => {
    const newTree = patchTree(tree, updatedCategory);
    saveTree(newTree);
  }, [tree, saveTree]);

  const handleAddCategory = useCallback((parentId: string | null) => {
    const newCategory = createTempCategory(parentId);
    const newTree = insertCategory(tree, newCategory, parentId);

    const normalized = normalizeSortOrder(newTree);
    setTree(normalized);
    saveTree(normalized);
  }, [tree, saveTree]);

  const handleDelete = useCallback((id: string) => {
      const newTree = removeCategory(tree, id);
      
      const normalized = normalizeSortOrder(newTree);
      setTree(normalized);
      saveTree(normalized);
  }, [tree, saveTree]);

  // set placeholders
  if (isLoading) {
    return (
      <Card title="Loading categories...">
        loading spinner placeholder
      </Card>
    );
  }
  if (error) {
    return (
      <Card title="Error loading categories">
        {error.message}
      </Card>
    );
  }

  return (
    <Card title="Categories">
      <div className={styles.categoryTreeContainer}>
        <SortableTree
          items={tree}
          onChange={(reorderedTree: Category[]) => {
            const newTree = normalizeSortOrder(reorderedTree);
            saveTree(newTree);
          }}
          childrenOptions={{ labels: { singular: 'subcategory', plural: 'subcategories' } }}
          renderItem={(category: Category) => (
            <CategoryItem category={category} onEdit={handleEdit} onAddChild={handleAddCategory} onDelete={handleDelete} />
          )}
        />
      </div>
    </Card>
  );
};

export default Categories;
