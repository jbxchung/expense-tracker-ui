import { useState, useCallback } from 'react';

import type { Transaction } from 'types/transaction';
import { updateTransaction } from 'api/transactions';

export function useUpdateTransaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(async (transaction: Partial<Omit<Transaction, 'createdAt' | 'updatedAt'>> & { id: string }) => {
    setLoading(true);
    setError(null);

    try {
      return await updateTransaction(transaction);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}
