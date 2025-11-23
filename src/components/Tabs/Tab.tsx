import type { ReactElement } from 'react';

import styles from './Tabs.module.scss';

export type TabElement = ReactElement<TabProps, typeof Tab>;

export interface TabProps {
  title: string;
  children: React.ReactNode;
}

// button is managed by parent Tabs component, this is just the content of the Tab
export const Tab = ({ children }: TabProps) => {
  return <div className={styles.tabContent}>{children}</div>;
};
