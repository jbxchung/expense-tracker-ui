import { useState, useRef, useEffect, type FC } from 'react';
import { createPortal } from 'react-dom';

import Button, { ButtonVariants, type ButtonVariant } from 'components/Button/Button';

import styles from './Dropdown.module.scss';

export interface DropdownOption {
  label: string;
  value: string;
  depth?: number; // optional for nested options
}

interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  renderOption?: (option: DropdownOption) => React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  buttonStyleVariant?: ButtonVariant;
  suppressArrow?: boolean;
  className?: string;
}

const Dropdown: FC<DropdownProps> = ({
  label,
  options,
  renderOption,
  value,
  onChange,
  placeholder = "Select an option",
  buttonStyleVariant = ButtonVariants.SECONDARY,
  suppressArrow = false,
  className = "",
}) => {
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
      {label && <span className={styles.label}>{label}</span>}

      <Button
        variant={buttonStyleVariant}
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
        {!suppressArrow &&
          <span className={styles.icon}>{open ? "▲" : "▼"}</span>
        }
      </Button>

      {open &&
        createPortal(
          <ul
            ref={listRef}
            className={styles.menu}
            style={{
              top: position.top,
              left: position.left,
              minWidth: position.width,
            }}
            onClick={e => e.stopPropagation()} // dont bubble up on selection
          >
            {options.map((option, i) => (
              <li
                key={option.value}
                className={`${styles.option} ${i === highlightIndex ? styles.highlight : ''}`}
                style={{ '--depth': option.depth ?? 0 } as React.CSSProperties}
                onMouseEnter={() => setHighlightIndex(i)}
                onClick={() => {
                  onChange?.(option.value);
                  setOpen(false);
                }}
              >
                {renderOption ? renderOption(option) : option.label}
              </li>
            ))}
          </ul>,
          document.body
        )}
    </div>
  );
}

export default Dropdown;
