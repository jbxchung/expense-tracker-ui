import { useState, useCallback } from 'react';

import type { Transaction } from 'types/transaction';
import { deleteTransaction } from 'api/transactions';

export function useDeleteTransaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(async (id: string): Promise<Transaction | undefined> => {
    setLoading(true);
    setError(null);

    try {
      return await deleteTransaction(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { remove, loading, error };
}
