import { useState, useRef, useEffect, type FC } from 'react';

import Input, { type InputHandle } from 'components/Input/Input';

import styles from './InlineEdit.module.scss';

interface InlineEditProps {
  value: string;
  onSave: (newValue: string) => void;
  onCancel?: () => void;
  className?: string;
  placeholder?: string;
}

const InlineEdit: FC<InlineEditProps> = ({
  value,
  onSave,
  onCancel,
  className = '',
  placeholder = 'Click to edit',
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<InputHandle | null>(null);

  useEffect(() => {
    if (editing) {
      setDraft(value);
      inputRef.current?.focus();
    }
  }, [editing, value]);

  const handleSave = () => {
    setEditing(false);
    if (draft !== value) onSave(draft);
  };

  const handleCancel = () => {
    setEditing(false);
    setDraft(value);
    onCancel?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  if (editing) {
    return (
      <Input
        ref={inputRef}
        value={draft}
        onChange={e => setDraft(e.target.value as T)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    );
  }

  // todo - custom styles for inline-edit?
  const classes = [styles.inlineEdit, className].filter(Boolean).join(' ');
  return (
    <span className={classes} onClick={() => setEditing(true)}>
      {value ?? <span className={styles.placeholder}>{placeholder}</span>}
    </span>
  );
};

export default InlineEdit;
