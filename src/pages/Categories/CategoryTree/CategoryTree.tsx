
import type { FC } from 'react';

import type { Category } from 'types/category';
import CategoryNode from './CategoryNode';

interface CategoryTreeProps {
  categories: Category[];
}

const CategoryTree: FC<CategoryTreeProps> = ({ categories }) => {
  return (
    <div>
      {categories.map(cat => (
        <CategoryNode
          key={cat.id}
          category={cat}
        />
      ))}
    </div>
  );
};

export default CategoryTree;
