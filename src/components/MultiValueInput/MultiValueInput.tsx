import { useState, useRef, useEffect, useCallback, type FC } from 'react';
import InlineEdit from 'components/InlineEdit/InlineEdit';
import Input from 'components/Input/Input';
import { createPortal } from 'react-dom';

import styles from './MultiValueInput.module.scss';

interface MultiValueInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

const MultiValueInput: FC<MultiValueInputProps> = ({ values, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalStyle, setModalStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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

  const openModal = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const modalHeight = 320;

    if (spaceBelow >= modalHeight) {
      setModalStyle({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
        transformOrigin: 'top center',
      });
    } else {
      setModalStyle({
        top: rect.top + window.scrollY - modalHeight - 4,
        left: rect.left + window.scrollX,
        width: rect.width,
        transformOrigin: 'bottom center',
      });
    }
    setIsOpen(true);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        modalRef.current && !modalRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  const modal = isOpen ? createPortal(
    <div ref={modalRef} className={styles.modal} style={modalStyle}>
      <div className={styles.modalChips}>
        {values.length === 0 && (
          <span className={styles.emptyState}>No values yet</span>
        )}
        {values.map((value, i) => (
          <span key={i} className={styles.chip}>
            <InlineEdit
              value={value}
              onSave={newValue => updateValue(i, newValue)}
            />
            <span
              className={styles.removeItemButton}
              onClick={() => onChange(values.filter(v => v !== value))}
            >
              &times;
            </span>
          </span>
        ))}
      </div>
      <div className={styles.modalInput}>
        <Input
          autoFocus
          placeholder={placeholder || 'Add value'}
          onBlur={e => {
            addValue(e.currentTarget.value);
            e.currentTarget.value = '';
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              addValue(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
        />
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <div
        ref={triggerRef}
        className={`${styles.multiValueInput} ${isOpen ? styles.active : ''}`}
        onClick={openModal}
      >
        {values.length === 0 ? (
          <span className={styles.triggerPlaceholder}>{placeholder || 'Add value'}</span>
        ) : (
          <span className={styles.triggerSummary}>
            {values.slice(0, 3).join(', ')}{values.length > 3 ? ` +${values.length - 3} more` : ''}
          </span>
        )}
        <span className={styles.triggerIcon}>{isOpen ? '▲' : '▼'}</span>
      </div>
      {modal}
    </>
  );
};

export default MultiValueInput;
