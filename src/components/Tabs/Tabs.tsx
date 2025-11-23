import { useState } from 'react';
import type { TabElement } from './Tab';

import styles from './Tabs.module.scss';
import Button, { ButtonVariants } from 'components/Button/Button';

interface TabsProps {
  defaultIndex?: number;
  children: TabElement | TabElement[];
}

export const Tabs = ({ defaultIndex = 0, children }: TabsProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const tabs = Array.isArray(children) ? children : [children];

  const tabsButtons = tabs.map((tab, index) => {
    const { title } = tab.props;
    const isActive = index === activeIndex;

    return (
      <Button
        variant={ButtonVariants.GHOST}
        className={styles.tabButton + (isActive ? ` ${styles.active}` : '')}
        key={index}
        onClick={() => setActiveIndex(index)}
      >
        {title}
      </Button>
    );
  });

  return (
    <div className={styles.tabsWrapper}>
      <div className={styles.tabsButtons}>
        {tabsButtons}
      </div>
      {tabs[activeIndex]}
    </div>
  );
};
