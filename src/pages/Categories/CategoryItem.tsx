import type { FC } from 'react';

import type { Category } from 'types/category';

import InlineEdit from 'components/InlineEdit/InlineEdit';

import styles from './Categories.module.scss';

interface CategoryItemProps {
  category: Category;
  onEdit: (updatedCategory: Category) => void;
}

const CategoryItem: FC<CategoryItemProps> = ({ category, onEdit }) => {

  return (
    <div className={styles.categoryItem}>
      <InlineEdit
        value={category.name}
        onSave={name => {
          const updated = { ...category, name };
          onEdit(updated);
        }}
      />
      <div className={styles.categoryDescription}>
        <InlineEdit
          // className={styles.categoryDescription}
          value={category.description ?? ''}
          onSave={description => {
            const updated = { ...category, description };
            onEdit(updated);
          }}
          placeholder='Add a description'
        />
      </div>
      <div className={styles.categoryActions}>
        {/* Placeholder for future actions like edit, delete */}
      </div>
    </div>
  );
};

export default CategoryItem;
