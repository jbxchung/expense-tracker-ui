
import type { FC } from 'react';

import styles from './Checkbox.module.scss';

interface CheckboxProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  title?: string;
  className?: string;
}

const Checkbox: FC<CheckboxProps> = ({ label, value, onChange, title, className = '' }) => (
  <span
    className={`${styles.toggle} ${className}`}
    onClick={() => onChange(!value)}
    title={title}
  >
    <span className={styles.checkbox}>{value ? '☑' : '☐'}</span>
    {label}
  </span>
);

export default Checkbox;
