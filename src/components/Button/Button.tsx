import React, { type ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

type ButtonType = 'primary' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  type?: ButtonType;
}

/**
 * Custom Button component
 * - Uses theme CSS variables
 * - Supports primary/secondary variants
 * - Automatically handles disabled state styling
 */
const Button: React.FC<ButtonProps> = ({
  children,
  type = "primary",
  className = "",
  ...props
}) => {
  const classes = `${styles.button} ${styles[variant]} ${className}`;
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
