import { useState, type FC, type ReactNode } from 'react';
import styles from './Accordion.module.scss';

interface AccordionProps {
  title: string | ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

const Accordion: FC<AccordionProps> = ({ title, defaultOpen = false, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={styles.accordion}>
      <div
        className={styles.header}
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <span>{isOpen ? '▾' : '▸'}</span>
      </div>
      {isOpen && <div className={styles.content}>{children}</div>}
    </div>
  );
};

export default Accordion;
