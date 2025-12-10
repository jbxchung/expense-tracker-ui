import { useState, type FC } from 'react';

import type { Category } from 'types/category';
import InlineEdit from 'components/InlineEdit/InlineEdit';

import styles from './Categories.module.scss';
import Button, { ButtonVariants } from 'components/Button/Button';

interface CategoryNodeProps {
  category: Category;
  onEdit: (category: Category) => void;
}

const CategoryNode: FC<CategoryNodeProps> = ({ category, onEdit }) => {
  const [open, setOpen] = useState(true);

  const expandable = category.children && category.children.length > 0;

  return (
    <div className={styles.categoryNode}>
      <div className={styles.row}>
        {expandable ? (
          <span className={styles.expandCategory} onClick={() => setOpen(o => !o)}>
            {open ? '▾' : '▸'}
          </span>
        ) : (
          <span className={styles.expandSpacer}>▸</span>
        )}


        <InlineEdit
          value={category.name}
          onSave={name => onEdit({ ...category, name })}
        />
        
        <Button
          title={`Add subcategory under "${category.name}"`}
          variant={ButtonVariants.GHOST}
          onClick={() => /* add child */ {}}
        >
          ＋
        </Button>
        <Button
          title={`Delete "${category.name}"`}
          variant={ButtonVariants.GHOST}
          onClick={() => /* delete */ {}}
        >
          🗑️
        </Button>
      </div>

      {expandable && open && (
        <div className={styles.expandedChildren}>
          {category.children?.map(child => (
            <CategoryNode
              key={child.id}
              category={child}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryNode;
