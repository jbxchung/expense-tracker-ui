import { useCallback, useEffect, useState, type FC } from 'react';

import type { Category } from 'types/category';
import { useCategoryTree, useSaveCategoryTree } from 'hooks/categories/useCategories';

import Card from 'components/Card/Card';

import styles from './Categories.module.scss';
import { patchTree } from 'utils/treeUtils';
import CategoryNode from './CategoryNode';


const Categories: FC = () => {
  const { categoryTree, isLoading, error } = useCategoryTree();
  const { saveTree, /*loading: saving*/ } = useSaveCategoryTree();

  // Local state holds the editable tree
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
  }, [saveTree, tree]);

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
        {categoryTree.map(category => (
          <CategoryNode
            key={category.id}
            category={category}
            onEdit={handleEdit}
          />
        ))}
      </div>
      <br />
      <div className={styles.debug}>
        <pre>{JSON.stringify(categoryTree, null, 4)}</pre>
      </div>
    </Card>
  );
};

export default Categories;
