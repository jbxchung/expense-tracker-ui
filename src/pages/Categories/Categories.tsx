import { useCallback, useEffect, useState, type FC } from 'react';

import type { Category } from 'types/category';
import { useCategoryTree, useSaveCategoryTree } from 'hooks/categories/useCategories';
import { patchTree } from 'utils/treeUtils';

import Card from 'components/Card/Card';
import InlineEdit from 'components/InlineEdit/InlineEdit';
import SortableTree from 'components/SortableTree/SortableTree';

import styles from './Categories.module.scss';

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
  }, [saveTree, tree]);

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
          onChange={(newTree: any) => {
            console.log('Tree changed:', newTree);
            // todo - persist changes
            // saveTree(newTree);
          }}
          renderItem={(category: Category) => (
            <InlineEdit
              value={category.name}
              onSave={name => {
                const updated = { ...category, name };
                handleEdit(updated);
              }}
            />
          )}
        />
      </div>
        
      {/* TODO - remove below after finished */}
      <br />
      <div className={styles.debug}>
        <pre>{JSON.stringify(categoryTree, null, 4)}</pre>
      </div>
      {/* TODO - remove above after finished */}
    </Card>
  );
};

export default Categories;
