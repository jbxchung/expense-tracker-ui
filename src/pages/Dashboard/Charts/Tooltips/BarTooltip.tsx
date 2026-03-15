import type { Account } from 'types/account';

import styles from './Tooltips.module.scss';

interface BarTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  accounts: Account[];
}

const BarTooltip = ({ active, payload, label, accounts }: BarTooltipProps) => {
  if (!active || !payload?.length) return null;

  const total = payload.reduce((sum, entry) => sum + (entry.value as number), 0);

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipTitle}>{label}</div>
      {payload.map((entry: any) => {
        const account = accounts.find(a => a.id === entry.dataKey);
        return (
          <div key={entry.dataKey} className={styles.tooltipRow}>
            <span style={{ color: entry.fill }}>{account?.name ?? entry.dataKey}</span>
            <span>${(entry.value as number).toFixed(2)}</span>
          </div>
        );
      })}
      {payload.length > 1 && (
        <div className={styles.tooltipRow}>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
};

export default BarTooltip;
