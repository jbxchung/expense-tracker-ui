import React, { forwardRef, useImperativeHandle, useState } from 'react';

import styles from './Input.module.scss';

export interface InputHandle {
  validate: () => boolean;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  validate?: (value: string) => string | null; // custom validation function
}

const Input = forwardRef<InputHandle, InputProps>(
  ({ label, className = "", validate, onChange, ...props}, ref) => {
  const [error, setError] = useState<string | null>(null);
  
  useImperativeHandle(ref, () => ({
    validate: () => {
      if (validate) {
        const errorMessage = validate((props.value as string) || "");
        setError(errorMessage);
        return !errorMessage;
      }
      return true;
    },
  }));

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (validate) {
      const errorMessage = validate(event.target.value);
      setError(errorMessage);
    }
  };
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event);
    }
    if (error) {
      // Revalidate on change
      handleBlur(event as unknown as React.FocusEvent<HTMLInputElement>);
    }
  };

  return (
    <div className={`${styles.inputContainer} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        onBlur={handleBlur}
        onChange={handleChange}
        {...props}
      />
      {error && (
        <div className={styles.errorText}>{error}</div>
      )}
    </div>
  );
});

export default Input;
