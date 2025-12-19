import { useCallback, useEffect, useState } from 'react';
import type { Transaction } from 'types/transaction';
import { fetchTransactions } from 'api/transactions';

interface UseTransactionsOptions {
  accountIds: string[];
  from?: Date;
  to?: Date;
}

// not using SWR since we want custom caching of transactions per account and date range
export const useTransactions = ({ accountIds, from, to }: UseTransactionsOptions) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAndSet = useCallback(async (skipCache = false) => {
    if (!accountIds.length) {
      setTransactions([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const txs = await fetchTransactions(accountIds, from, to, skipCache);
      setTransactions(txs);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }, [accountIds, from, to]);

  // fetch on mount or when dependencies change
  useEffect(() => {
    fetchAndSet();
  }, [fetchAndSet]);

  // manual refresh
  const refresh = useCallback(() => fetchAndSet(true), [fetchAndSet]);

  return { transactions, isLoading, error, refresh };
};
