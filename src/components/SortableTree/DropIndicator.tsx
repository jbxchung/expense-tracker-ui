import type { FC } from "react";

import styles from './SortableTree.module.scss';

interface DropIndicatorProps {
  depth: number;
}

const DropIndicator: FC<DropIndicatorProps> = ({ depth }) => {
  return (
    <div
      className={styles.dropIndicator}
      style={{ '--depth': depth } as React.CSSProperties}
    />
  );
};

export default DropIndicator;
