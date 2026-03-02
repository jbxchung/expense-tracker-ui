import Input from 'components/Input/Input';
import { useState } from 'react';
import type { EditCellProps } from 'types/table';

// this component 
export const DescriptionEditCell = ({ getValue, setValue }: EditCellProps<any>) => {
  const [draft, setDraft] = useState(getValue() ?? '');

  return (
    <Input
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={() => setValue(draft)}
      onKeyDown={e => {
        if (e.key === 'Enter') setValue(draft);
        if (e.key === 'Escape') setDraft(getValue() ?? '');
      }}
    />
  );
};
