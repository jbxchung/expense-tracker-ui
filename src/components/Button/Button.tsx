import { forwardRef, type ButtonHTMLAttributes } from 'react';

import styles from './Button.module.scss';

export const ButtonVariants = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  GHOST: 'ghost',
} as const;
export type ButtonVariant = typeof ButtonVariants[keyof typeof ButtonVariants];

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  outline?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = ButtonVariants.PRIMARY, outline = false, className = '', ...props}, ref) => {
  const classes = `${styles.button} ${styles[variant as keyof typeof styles]} ${outline ? styles.outline : ''} ${className}`;
  return (
    <button className={classes} ref={ref} {...props}>
      {children}
    </button>
  );
});

export default Button;
