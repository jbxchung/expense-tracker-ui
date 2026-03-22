import { useMemo, useState, type FC } from 'react';
import {
  PieChart, Pie, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

import { type Account, AccountTypes } from 'types/account';
import type { Category } from 'types/category';
import type { Transaction } from 'types/transaction';

import { useCategoryTree } from 'hooks/categories/useCategories';
import { flattenTree } from 'utils/treeUtils';

import Card from 'components/Card/Card';
import MultiSelect from 'components/Multiselect/Multiselect';

import PieTooltip from './Tooltips/PieTooltip';
import BarTooltip from './Tooltips/BarTooltip';

import styles from './Charts.module.scss';
import Spinner from 'components/Spinner/Spinner';

type TimeBucket = 'daily' | 'weekly' | 'monthly';

interface ChartsProps {
  accounts: Account[];
  accountsLoading: boolean;
  transactions: Transaction[];
  transactionsLoading: boolean;
  dateRange: { from: Date; to: Date };
}

type SpendingByAccount = Record<string, number>;

function getDefaultBucket(from: Date, to: Date): TimeBucket {
  const days = (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);
  if (days <= 14) return 'daily';
  if (days <= 90) return 'weekly';
  return 'monthly';
}

function getBucketKey(date: Date, bucket: TimeBucket): string {
  const d = new Date(date);
  if (bucket === 'daily') {
    return d.toLocaleDateString('default', { month: 'short', day: 'numeric' });
  }
  if (bucket === 'weekly') {
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return d.toLocaleDateString('default', { month: 'short', day: 'numeric' });
  }
  return d.toLocaleDateString('default', { month: 'short', year: 'numeric' });
}

const normalizeAmount = (tx: Transaction, accounts: Account[]): number => {
  const account = accounts.find(a => a.id === tx.accountId);
  if (account?.type === AccountTypes.CREDIT_CARD) {
    return -Number(tx.amount);
  }
  return Number(tx.amount);
};

const CHART_COLORS = [
  'var(--color-chart-1, #6366f1)',
  'var(--color-chart-2, #f59e0b)',
  'var(--color-chart-3, #10b981)',
  'var(--color-chart-4, #ef4444)',
  'var(--color-chart-5, #3b82f6)',
  'var(--color-chart-6, #ec4899)',
  'var(--color-chart-7, #14b8a6)',
  'var(--color-chart-8, #f97316)',
];

const Charts: FC<ChartsProps> = ({ accounts, accountsLoading, transactions, transactionsLoading, dateRange }) => {
  const { categoryTree } = useCategoryTree();

  const flatCategories = useMemo(
    () => flattenTree<Category>(categoryTree),
    [categoryTree]
  );

  // category ids excluded from reports, including all descendants
  const excludedCategoryIds = useMemo(() => new Set(
    flatCategories
      .filter(c => c.excludeFromReports)
      .flatMap(c => [c.id, ...c.descendantIds])
  ), [flatCategories]);

  // selected category ids for pie drill-down, empty means top-level only
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  // manual bucket select, null means auto
  const [bucketOverride, setBucketOverride] = useState<TimeBucket | null>(null);
  const bucket = bucketOverride ?? getDefaultBucket(dateRange.from, dateRange.to);

  const accountIds = useMemo(
    () => [...new Set(transactions.map(tx => tx.accountId))],
    [transactions]
  );

  // pie chart data - group by selected or top-level categories
  const pieData = useMemo(() => {
    const topLevelCategoryIds = flatCategories.filter(c => c.depth === 0).map(c => c.id);

    const groupIds = selectedCategoryIds.length > 0
      ? selectedCategoryIds
      : topLevelCategoryIds;

    const totals = new Map<string, { net: number; positive: number; negative: number }>();

    for (const tx of transactions) {
      if (!tx.categoryId) continue;
      if (excludedCategoryIds.has(tx.categoryId)) continue;

      const cat = flatCategories.find(c => c.id === tx.categoryId);
      if (!cat) continue;

      const groupId = groupIds.find(id =>
        id === tx.categoryId || cat.ancestorIds.includes(id)
      );

      if (groupId) {
        if (!totals.has(groupId)) {
          totals.set(groupId, { net: 0, positive: 0, negative: 0 });
        }
        const entry = totals.get(groupId)!;
        const amount = normalizeAmount(tx, accounts);
        entry.net += amount;
        if (amount > 0) {
          entry.positive += amount;
        } else {
          entry.negative += amount;
        }
      }
    }

    return Array.from(totals.entries()).map(([id, entry], i) => ({
      name: flatCategories.find(c => c.id === id)?.name ?? id,
      value: Math.abs(parseFloat(entry.net.toFixed(2))),
      net: parseFloat(entry.net.toFixed(2)),
      positiveTotal: parseFloat(entry.positive.toFixed(2)),
      negativeTotal: parseFloat(entry.negative.toFixed(2)),
      fill: CHART_COLORS[i % CHART_COLORS.length],
    }))
    .filter(entry => entry.net < 0)
    .sort((a, b) => b.value - a.value);
  }, [accounts, transactions, flatCategories, selectedCategoryIds, excludedCategoryIds]);

  // bar chart data - group by time bucket and account, excluding excluded categories
  const barData = useMemo(() => {
    const sorted = [...transactions].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const buckets = new Map<string, SpendingByAccount>();

    for (const tx of sorted) {
      if (!tx.categoryId) continue;
      if (excludedCategoryIds.has(tx.categoryId)) continue;

      const amount = normalizeAmount(tx, accounts);
      if (amount >= 0) continue;

      const key = getBucketKey(new Date(tx.date), bucket);
      if (!buckets.has(key)) buckets.set(key, {});
      const entry = buckets.get(key)!;
      entry[tx.accountId] = (entry[tx.accountId] ?? 0) + Math.abs(amount);
    }

    return Array.from(buckets.entries()).map(([date, amounts]) => ({
      date,
      ...amounts,
    }));
  }, [accounts, transactions, bucket, excludedCategoryIds]);

  const categoryOptions = useMemo(
    () => flatCategories
      .filter(c => !excludedCategoryIds.has(c.id))
      .map(c => ({
        value: c.id,
        label: c.name,
        depth: c.depth,
        descendantIds: c.descendantIds,
        ancestorIds: c.ancestorIds,
      })),
    [flatCategories, excludedCategoryIds]
  );

  return (
    <div className={styles.chartsGrid}>
      <Card title="Spending by Category">
        {(accountsLoading || transactionsLoading) ? (
          <div className={styles.loading}>
            <Spinner />
          </div>
        ) : (<>
          <div className={styles.chartControls}>
            <MultiSelect
              options={categoryOptions}
              value={selectedCategoryIds}
              onChange={setSelectedCategoryIds}
              placeholder="Top-level categories"
              label="Break down by"
            />
          </div>
          {pieData.length === 0 ? (
            <div className={styles.empty}>No spending data for this period.</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                  isAnimationActive={false}
                />
                <Tooltip content={<PieTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
          </>
        )}
      </Card>

      <Card title="Spending Over Time">
        {(accountsLoading || transactionsLoading) ? (
          <div className={styles.loading}>
            <Spinner />
          </div>
        ) : (<>
          <div className={styles.chartControls}>
            {(['daily', 'weekly', 'monthly'] as TimeBucket[]).map(b => (
              <button
                key={b}
                className={`${styles.bucketButton} ${bucket === b ? styles.active : ''}`}
                onClick={() => setBucketOverride(prev => prev === b ? null : b)}
                title={bucketOverride === b ? 'Click to reset to auto' : `Group by ${b}`}
              >
                {b.charAt(0).toUpperCase() + b.slice(1)}
                {bucketOverride === null && bucket === b && (
                  <span className={styles.autoBadge}>auto</span>
                )}
              </button>
            ))}
          </div>
          {barData.length === 0 ? (
            <div className={styles.empty}>No spending data for this period.</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} tickFormatter={v => `$${v}`} />
                <Tooltip content={<BarTooltip accounts={accounts} />} />
                <Legend formatter={name => accounts.find(a => a.id === name)?.name ?? name} />
                {accountIds.map((accountId, i) => (
                  <Bar
                    key={accountId}
                    dataKey={accountId}
                    stackId="spending"
                    fill={CHART_COLORS[i % CHART_COLORS.length]}
                    radius={i === accountIds.length - 1 ? [4, 4, 0, 0] : undefined}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </>)}
      </Card>
    </div>
  );
};

export default Charts;
