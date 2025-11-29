import React from 'react';

import styles from './Card.module.scss';

interface CardProps {
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, children, footer, onClick }) => {
  return (
    <div className={styles.card} onClick={onClick}>
      {title && <div className={styles.header}>{title}</div>}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};

export default Card;
