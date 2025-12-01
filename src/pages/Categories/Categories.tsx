import { useState, type FC } from 'react';

// import { DEFAULT_IMPORTER, type Importer } from 'types/importer';
// import { useAppContext } from 'contexts/app/AppContext';
import { useCategoryTree } from 'hooks/useCategories';

import Card from 'components/Card/Card';
import { CategoryTree } from './CategoryTree/CategoryTree';

import styles from './Categories.module.scss';


const Categories: FC = () => {
  // const { accounts, accountsLoading, accountsError } = useAppContext();
  const { categoryTree, isLoading, error } = useCategoryTree();

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
      <CategoryTree categories={categoryTree} />
      <div className={styles.debug}>
        <pre>{JSON.stringify(categoryTree, null, 4)}</pre>
      </div>
    </Card>
  );
};

export default Categories;
