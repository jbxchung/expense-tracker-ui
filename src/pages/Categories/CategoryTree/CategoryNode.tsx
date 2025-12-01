import type { FC } from 'react';

import type { Category } from 'types/category';
import Accordion from 'components/Accordion/Accordion';

interface CategoryNodeProps {
  category: Category;
}

const CategoryNode: FC<CategoryNodeProps> = ({ category }) => {
  return (
    <div style={{ marginLeft: category.parentId ? 20 : 0 }}>
      <Accordion title={category.name}>
        <div>
          <p>{category.description}</p>

          <div style={{ display: "flex", gap: 8 }}>
            {/* <button onClick={() => onEdit(category)}>Edit</button>
            <button onClick={() => onAddChild(category)}>Add Child</button>
            <button onClick={() => onDelete(category)}>Delete</button> */}
          </div>

          {category.children?.length > 0 && (
            <div style={{ marginTop: 10 }}>
              {category.children.map(child => (
                <CategoryNode
                  key={child.id}
                  category={child}
                  // onEdit={onEdit}
                  // onDelete={onDelete}
                  // onAddChild={onAddChild}
                />
              ))}
            </div>
          )}
        </div>
      </Accordion>
    </div>
  );
};

export default CategoryNode;
