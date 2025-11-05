import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

import styles from './Dropdown.module.scss';
import Button, { ButtonVariants } from 'components/Button/Button';

interface DropdownOption<T extends string | number> {
  label: string;
  value: T;
}

interface DropdownProps<T extends string | number> {
  label?: string;
  options: DropdownOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
  placeholder?: string;
  className?: string;
}

export function Dropdown<T extends string | number>({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIndex((i) => (i + 1) % options.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIndex((i) => (i - 1 + options.length) % options.length);
      } else if (e.key === "Enter" && highlightIndex >= 0) {
        const selected = options[highlightIndex];
        onChange?.(selected.value);
        setOpen(false);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, options, highlightIndex, onChange]);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        !buttonRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`${styles.dropdownContainer} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}

      <Button
        variant={ButtonVariants.SECONDARY}
        outline
        ref={buttonRef}
        onClick={(e) => {
          e.preventDefault(); // do not submit a form if we're in one
          setOpen(prev => !prev);
        }}
        className={`${styles.button}`}
      >
        <span className={selectedOption ? styles.text : styles.placeholder}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={styles.icon}>{open ? "▲" : "▼"}</span>
      </Button>

      {open &&
        createPortal(
          <ul
            ref={listRef}
            className={styles.menu}
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
            }}
            onClick={e => e.stopPropagation()} // dont bubble up on selection
          >
            {options.map((opt, i) => (
              <li
                key={opt.value}
                className={`${styles.option} ${i === highlightIndex ? styles.highlight : ''}`}
                onMouseEnter={() => setHighlightIndex(i)}
                onClick={() => {
                  onChange?.(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>,
          document.body
        )}
    </div>
  );
}
