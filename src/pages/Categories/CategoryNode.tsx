import { useState, type FC } from 'react';

import type { Category } from 'types/category';
import InlineEdit from 'components/InlineEdit/InlineEdit';

import styles from './Categories.module.scss';

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
        
        <button onClick={() => /* add child */ {}}>＋</button>
        <button onClick={() => /* delete */ {}}>🗑️</button>
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
