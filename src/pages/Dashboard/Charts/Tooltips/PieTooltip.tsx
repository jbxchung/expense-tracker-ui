import styles from './Tooltips.module.scss';

const PieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, net, positiveTotal, negativeTotal } = payload[0].payload;
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipTitle}>{name}</div>
      <div className={styles.tooltipRow}>
        <span>Net</span>
        <span>${net.toFixed(2)}</span>
      </div>
      <div className={styles.tooltipRow}>
        <span>In</span>
        <span className={styles.positive}>+${positiveTotal.toFixed(2)}</span>
      </div>
      <div className={styles.tooltipRow}>
        <span>Out</span>
        <span className={styles.negative}>-${Math.abs(negativeTotal).toFixed(2)}</span>
      </div>
    </div>
  );
};

export default PieTooltip;