import { useState, type ReactElement } from 'react';
import Button, { ButtonVariants } from 'components/Button/Button';

import styles from './Tabs.module.scss';

interface TabsProps {
  defaultIndex?: number;
  children: TabElement | TabElement[];
}

const Tabs = ({ defaultIndex = 0, children }: TabsProps) => {
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

// single tab
export type TabElement = ReactElement<TabProps, typeof Tab>;

export interface TabProps {
  title: string;
  children: React.ReactNode;
}

// button is managed by parent Tabs component, this is just the content of the Tab
const Tab = ({ children }: TabProps) => {
  return <div className={styles.tabContent}>{children}</div>;
};
Tabs.Tab = Tab;

export default Tabs;
