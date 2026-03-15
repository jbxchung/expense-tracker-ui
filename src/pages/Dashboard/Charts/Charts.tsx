import { useMemo, useState, type FC } from 'react';
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip,
} from 'recharts';

import type { Transaction } from 'types/transaction';
import type { Category } from 'types/category';

import { useCategoryTree } from 'hooks/categories/useCategories';
import { flattenTree } from 'utils/treeUtils';

import Card from 'components/Card/Card';
import MultiSelect from 'components/Multiselect/Multiselect';

import styles from './Charts.module.scss';

type TimeBucket = 'daily' | 'weekly' | 'monthly';

interface ChartsProps {
  transactions: Transaction[];
  dateRange: { from: Date; to: Date };
}

// auto-select bucket based on date range span
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
    // start of week
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return d.toLocaleDateString('default', { month: 'short', day: 'numeric' });
  }
  return d.toLocaleDateString('default', { month: 'short', year: 'numeric' });
}

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

const Charts: FC<ChartsProps> = ({ transactions, dateRange }) => {
  const { categoryTree } = useCategoryTree();

  const flatCategories = useMemo(
    () => flattenTree<Category>(categoryTree),
    [categoryTree]
  );

  // selected category ids for pie drill-down — empty means top-level only
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  // bucket override — null means auto
  const [bucketOverride, setBucketOverride] = useState<TimeBucket | null>(null);
  const bucket = bucketOverride ?? getDefaultBucket(dateRange.from, dateRange.to);

  // spending transactions only (negative amounts)
  const spendingTransactions = useMemo(
    () => transactions.filter(tx => Number(tx.amount) < 0),
    [transactions]
  );

  // pie chart data — group by selected or top-level categories
  const pieData = useMemo(() => {
    const topLevelIds = flatCategories.filter(c => c.depth === 0).map(c => c.id);

    // determine which category ids to group by
    const groupIds = selectedCategoryIds.length > 0
      ? selectedCategoryIds
      : topLevelIds;

    const totals = new Map<string, number>();

    for (const tx of spendingTransactions) {
      if (!tx.categoryId) continue;
      const amount = Math.abs(Number(tx.amount));

      // find which group this transaction belongs to
      const cat = flatCategories.find(c => c.id === tx.categoryId);
      if (!cat) continue;

      // check if tx.categoryId is a descendant of any group id
      const groupId = groupIds.find(id =>
        id === tx.categoryId || cat.ancestorIds.includes(id)
      );

      if (groupId) {
        totals.set(groupId, (totals.get(groupId) ?? 0) + amount);
      }
    }

    return Array.from(totals.entries()).map(([id, value]) => ({
      name: flatCategories.find(c => c.id === id)?.name ?? id,
      value: parseFloat(value.toFixed(2)),
    })).sort((a, b) => b.value - a.value);
  }, [spendingTransactions, flatCategories, selectedCategoryIds]);

  // bar chart data — group by time bucket
  const barData = useMemo(() => {
    const buckets = new Map<string, number>();

    for (const tx of spendingTransactions) {
      const key = getBucketKey(new Date(tx.date), bucket);
      buckets.set(key, (buckets.get(key) ?? 0) + Math.abs(Number(tx.amount)));
    }

    return Array.from(buckets.entries()).map(([date, amount]) => ({
      date,
      amount: parseFloat(amount.toFixed(2)),
    }));
  }, [spendingTransactions, bucket]);

  const categoryOptions = useMemo(
    () => flatCategories.map(c => ({
      value: c.id,
      label: c.name,
      depth: c.depth,
      descendantIds: c.descendantIds,
      ancestorIds: c.ancestorIds,
    })),
    [flatCategories]
  );

  return (
    <div className={styles.chartsGrid}>
      <Card title="Spending by Category">
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
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <PieTooltip formatter={(value) => `$${((value ?? 0) as number).toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card title="Spending Over Time">
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
              <BarTooltip formatter={value => [`$${((value ?? 0) as number).toFixed(2)}`, 'Spending']} />
              <Bar dataKey="amount" fill="var(--color-chart-1, #6366f1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
};

export default Charts;
