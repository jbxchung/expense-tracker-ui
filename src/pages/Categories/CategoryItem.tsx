import type { FC } from 'react';

import type { Category } from 'types/category';

import InlineEdit from 'components/InlineEdit/InlineEdit';

import styles from './Categories.module.scss';
import { AddChildIcon } from 'icons/AddChildIcon';
import { TrashIcon } from 'icons/TrashIcon';

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
        <span
          title="Add Subcategory"
          onClick={(e) => {
            // todo - add child category
          }}
        >
          <AddChildIcon />
        </span>
        <span
          className={styles.deleteIcon}
          title={`Delete '${category.name}'`}
          onClick={(e) => {
            // todo - delete this category
          }}
        >
          <TrashIcon />
        </span>
      </div>
    </div>
  );
};

export default CategoryItem;
