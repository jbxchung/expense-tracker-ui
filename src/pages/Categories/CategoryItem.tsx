import type { FC } from 'react';

import type { Category } from 'types/category';

import Button, { ButtonVariants } from 'components/Button/Button';
import InlineEdit from 'components/InlineEdit/InlineEdit';

import { AddChildIcon } from 'icons/AddChildIcon';
import { TrashIcon } from 'icons/TrashIcon';

import styles from './Categories.module.scss';
import Checkbox from 'components/Checkbox/Checkbox';

interface CategoryItemProps {
  category: Category;
  onEdit: (updatedCategory: Category) => void;
  onAddChild: (parentId: string) => void;
  onDelete: (id: string) => void;
}

const CategoryItem: FC<CategoryItemProps> = ({ category, onEdit, onAddChild, onDelete }) => {
  const allowDelete = !category.children?.length  && !category.transactionCount;

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
          // todo - fix long description wrapping lines, we should scroll on editing and truncate with ellipsis on display
          // className={styles.categoryDescription}
          value={category.description ?? ''}
          onSave={description => {
            const updated = { ...category, description };
            onEdit(updated);
          }}
          placeholder='Add a description'
        />
      </div>
      <Checkbox
        className={styles.excludeFromReports}
        label="Balanced"
        title="Exclude transactions in this category from spending and charts (useful for balancing payments and account transfers)"
        value={category.excludeFromReports}
        onChange={excludeFromReports => onEdit({ ...category, excludeFromReports })}
      />
      <div className={styles.categoryActions}>
        <Button
          title="Add Subcategory"
          variant={ButtonVariants.ICON}
          onClick={() => onAddChild(category.id)}
        >
          <AddChildIcon />
        </Button>
        <Button
          className={styles.deleteIcon}
          title={`Delete '${category.name}'`}
          variant={ButtonVariants.ICON}
          disabled={!allowDelete}
          onClick={() => onDelete(category.id)}
        >
          <TrashIcon />
        </Button>
      </div>
    </div>
  );
};

export default CategoryItem;
