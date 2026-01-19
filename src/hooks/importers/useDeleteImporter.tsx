import { useState, useCallback } from 'react';
import { mutate } from 'swr';

import type { Importer } from 'types/importer';
import { IMPORTERS_API_PATH, deleteImporter } from 'api/importers';

export function useDeleteImporter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(async (importerId: string) => {
    setLoading(true);
    setError(null);

    try {
      await deleteImporter(importerId);

      // remove importer from SWR cache manually
      mutate(IMPORTERS_API_PATH, (importers: Importer[] = []) => importers.filter(imp => imp.id !== importerId), false);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { remove, loading, error };
}
