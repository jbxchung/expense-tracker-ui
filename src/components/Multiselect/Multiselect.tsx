import { useState, useRef, useEffect, type FC, type ReactNode, useMemo } from 'react';
import { createPortal } from 'react-dom';

import Button, { ButtonVariants, type ButtonVariant } from 'components/Button/Button';

import styles from './Multiselect.module.scss';

export interface MultiselectOption {
  label: string;
  value: string;
  // to keep track of hierarchy / nesting
  depth?: number;
  descendantIds?: string[];
  ancestorIds?: string[];
}

// derive partially selected ids from current selection and options
function getPartialIds(selected: string[], options: MultiselectOption[]): Set<string> {
  const partial = new Set<string>();
  for (const opt of options) {
    if (!opt.descendantIds?.length) continue;
    const selectedDescendants = opt.descendantIds.filter(id => selected.includes(id));
    if (selectedDescendants.length > 0 && selectedDescendants.length < opt.descendantIds.length) {
      partial.add(opt.value);
    }
  }
  return partial;
}

interface MultiselectProps {
  options: MultiselectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  placeholder?: string;
  trigger?: ReactNode;
  buttonStyleVariant?: ButtonVariant;
  className?: string;
}

const Multiselect: FC<MultiselectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select options',
  trigger,
  buttonStyleVariant = ButtonVariants.SECONDARY,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const isActive = value.length > 0;
  
  // derive partial ids for display
  const partialIds = useMemo(() => getPartialIds(value, options), [value, options]);

  // derive display label from selected values
  const selectedLabels = options
    .filter(opt => value.includes(opt.value))
    .map(opt => opt.label)
    .join(', ');
  
  // position panel and focus search input when opening
  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
      setTimeout(() => searchRef.current?.focus(), 0);
    } else {
      setSearch('');
    }
  }, [open]);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !panelRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // close on escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOption = (option: MultiselectOption) => {
    const isSelected = value.includes(option.value);
    let next = [...value];

    if (isSelected) {
      // deselect item and all descendants
      const toRemove = new Set([option.value, ...(option.descendantIds ?? [])]);
      next = next.filter(v => !toRemove.has(v));
    } else {
      // select item and all descendants
      const toAdd = [option.value, ...(option.descendantIds ?? [])].filter(v => !next.includes(v));
      next = [...next, ...toAdd];
    }

    onChange(next);
  };

  const clearAll = () => onChange([]);

  return (
    <div className={`${styles.multiselect} ${className}`}>
      {label && <span className={styles.label}>{label}</span>}

      {trigger ? (
        <button
          ref={triggerRef}
          className={`${styles.customTrigger} ${isActive ? styles.active : ''}`}
          onClick={() => setOpen(prev => !prev)}
        >
          {trigger}
          {isActive && <span className={styles.badge}>{value.length}</span>}
        </button>
      ) : (
        <Button
          ref={triggerRef}
          variant={buttonStyleVariant}
          outline
          className={styles.button}
          onClick={e => {
            e.preventDefault();
            setOpen(prev => !prev);
          }}
        >
          <span className={isActive ? styles.text : styles.placeholder}>
            {isActive ? selectedLabels : placeholder}
          </span>
          <span className={styles.icon}>{open ? '▲' : '▼'}</span>
        </Button>
      )}

      {open && createPortal(
        <div
          ref={panelRef}
          className={styles.panel}
          style={{ top: position.top, left: position.left, minWidth: position.width }}
        >
          <div className={styles.searchRow}>
            <input
              ref={searchRef}
              className={styles.search}
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {isActive && (
              <button className={styles.clearButton} onClick={clearAll}>
                Clear
              </button>
            )}
          </div>
          <ul className={styles.options}>
            {filteredOptions.length === 0 && (
              <li className={styles.empty}>No options</li>
            )}
            {filteredOptions.map(option => {
              const selected = value.includes(option.value);
              const partial = !selected && partialIds.has(option.value);
              return (
                <li
                  key={option.value}
                  className={`${styles.option} ${selected ? styles.selected : ''} ${partial ? styles.partial : ''}`}
                  style={{ '--depth': option.depth ?? 0 } as React.CSSProperties}
                  onClick={() => toggleOption(option)}
                >
                  <span className={styles.checkbox}>
                    {selected ? '☑' : partial ? '⊟' : '☐'}
                  </span>
                  {option.label}
                </li>
              );
            })}
          </ul>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Multiselect;
