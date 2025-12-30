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
  validate?: (value: string) => string | string[] | null;    // custom validation function
  onValidityChange?: (isValid: boolean) => void;  // to notify caller
  selectAllOnFocus?: boolean;
}

const Input = forwardRef<InputHandle, InputProps>(({ label, className = "", selectAllOnFocus = false, validate, onChange, onValidityChange, ...props}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [touched, setTouched] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  
  // helper to run validation and call onValidityChange
  const runValidation = (value: string) => {
    if (validate) {
      const result = validate(value);
      const normalized = Array.isArray(result) ? result : (result ? [result] : []);
      setErrors(normalized);
      onValidityChange?.(normalized.length === 0);
      return normalized.length === 0;
    } else {
      onValidityChange?.(true);
      setErrors([]);
      return true;
    }
  };

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
    validate: () => runValidation((props.value as string) || ''),
  }));

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (selectAllOnFocus) e.target.select();
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    runValidation(e.target.value);
    if (props.onBlur) props.onBlur(e);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
    if (touched) runValidation(e.target.value); // revalidate after touched
  };

  return (
    <div className={`${styles.inputContainer} ${className}`}>
      {label && <span className={styles.label}>{label}</span>}
      <input
        ref={inputRef}
        className={`${styles.input} ${errors.length ? styles.inputError : ""}`}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
        {...props}
      />
      {touched && errors.length > 0 && (
        <div className={styles.errorText}>
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </div>
  );
});

export default Input;
