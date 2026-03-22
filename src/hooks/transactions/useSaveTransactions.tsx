import { useState, useCallback } from 'react';

import type { StagedTransaction } from 'types/transaction';
import { saveTransactions } from 'api/transactions';

export function useSaveTransactions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const save = useCallback(async (
    accountId: string,
    transactions: StagedTransaction[],
    fileName?: string,
    importerId?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      return await saveTransactions(accountId, transactions, fileName, importerId);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { save, loading, error };
};
