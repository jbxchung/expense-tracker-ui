import type { FC } from 'react';
import InlineEdit from 'components/InlineEdit/InlineEdit';
import Input from 'components/Input/Input';

import styles from './MultiValueInput.module.scss';

interface MultiValueInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

const MultiValueInput: FC<MultiValueInputProps> = ({ values, onChange, placeholder }) => {
  const addValue = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
  };

  const updateValue = (index: number, newValue: string) => {
    const newValues = [...values];
    newValues[index] = newValue;
    onChange(newValues);
  };

  return (
    <div className={styles.multiValueInput}>
      {values.map((value, i) => (
        <span key={i} className={styles.chip}>
          <InlineEdit
            value={value}
            onSave={newValue => updateValue(i, newValue)}
          />
          <span className={styles.removeItemButton} onClick={() => onChange(values.filter(v => v !== value))}>&times;</span>
        </span>
      ))}
      <Input
        placeholder={placeholder || 'Add value'}
        onBlur={e => {
          addValue(e.currentTarget.value);
          e.currentTarget.value = '';
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            addValue(e.currentTarget.value);
          }
        }}
      />
    </div>
  );
};

export default MultiValueInput;
