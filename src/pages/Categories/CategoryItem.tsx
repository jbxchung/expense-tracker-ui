import type { FC } from 'react';

import type { Category } from 'types/category';

import Button, { ButtonVariants } from 'components/Button/Button';
import InlineEdit from 'components/InlineEdit/InlineEdit';

import { AddChildIcon } from 'icons/AddChildIcon';
import { TrashIcon } from 'icons/TrashIcon';

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
        <Button
          title="Add Subcategory"
          variant={ButtonVariants.ICON}
          onClick={(e) => {
            // todo - add child category
          }}
        >
          <AddChildIcon />
        </Button>
        <Button
          className={styles.deleteIcon}
          title={`Delete '${category.name}'`}
          variant={ButtonVariants.ICON}
          disabled
          onClick={(e) => {
            // todo - delete this category
          }}
        >
          <TrashIcon />
        </Button>
      </div>
    </div>
  );
};

export default CategoryItem;
