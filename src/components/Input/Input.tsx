import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import styles from './Input.module.scss';

export interface InputHandle {
  focus: () => void;
  select?: () => void;
  setWidth?: (px: number) => void;
  validate?: () => boolean;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  validate?: (value: string) => string | null; // custom validation function
  selectAllOnFocus?: boolean;
}

const Input = forwardRef<InputHandle, InputProps>(({ label, className = "", selectAllOnFocus = false, validate, onChange, ...props}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    select: () => {
      inputRef.current?.select();
    },
    setWidth: (width: number) => {
      if (inputRef.current) {
        inputRef.current.style.width = `${width}px`;
      }
    },
    validate: () => {
      if (validate) {
        const errorMessage = validate((props.value as string) || "");
        setError(errorMessage);
        return !errorMessage;
      }
      return true;
    },
  }));

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (selectAllOnFocus) e.target.select();
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (validate) {
      const errorMessage = validate(e.target.value);
      setError(errorMessage);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
    if (error) handleBlur(e as unknown as React.FocusEvent<HTMLInputElement>); // revalidate on change
  };

  return (
    <div className={`${styles.inputContainer} ${className}`}>
      {label && <span className={styles.label}>{label}</span>}
      <input
        ref={inputRef}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
        {...props}
      />
      {error && (
        <div className={styles.errorText}>{error}</div>
      )}
    </div>
  );
});

export default Input;
