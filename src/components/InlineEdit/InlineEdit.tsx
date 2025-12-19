import { type FC, useState, useRef, useEffect, useLayoutEffect } from 'react';

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
  const mirrorRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (editing) {
      setDraft(value);
      inputRef.current?.focus();
      // inputRef.current?.select?.();
    }
  }, [editing, value]);

  // autosize input width
  useLayoutEffect(() => {
    if (!editing) return;
    if (!mirrorRef.current || !inputRef.current) return;

    const width = mirrorRef.current.offsetWidth;
    inputRef.current.setWidth?.(width + 2); // small buffer
  }, [draft, editing]);

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
      <div className={styles.inlineInputWrapper}>
        <Input
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={styles.inlineInput}
          autoFocus
        />
        <span className={styles.inputMirror} ref={mirrorRef}>{draft || placeholder}</span>
      </div>
    );
  }

  const classes = [styles.inlineEdit, className].filter(Boolean).join(' ');
  return (
    <div className={classes} onClick={() => setEditing(true)}>
      {value ?? <span className={styles.placeholder}>{placeholder}</span>}
    </div>
  );
};

export default InlineEdit;
