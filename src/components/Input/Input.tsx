import React, { useState } from 'react';

import styles from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  validate?: (value: string) => string | null; // custom validation function
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  validate,
  onChange,
  ...props
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (validate) {
      const errorMessage = validate(event.target.value);
      setValidationError(errorMessage);
    }
  };
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event);
    }
    if (validationError) {
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
      {(validationError || error) && (
        <div className={styles.errorText}>{validationError || error}</div>
      )}
    </div>
  );
};

export default Input;
