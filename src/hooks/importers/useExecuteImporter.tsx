import { useState, useCallback } from 'react';

import type { StagedTransaction } from 'types/transaction';
import { executeImporter } from 'api/importers';

export function useExecuteImporter() {
  const [result, setResult] = useState<StagedTransaction[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (importerId: string, file: File) => {
    setLoading(true);
    setError(null);

    try {
      const response = await executeImporter(importerId, file);
      setResult(response);
      return response;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, result, loading, error };
}
