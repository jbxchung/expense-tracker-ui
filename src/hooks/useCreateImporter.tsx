import { useState, useCallback } from 'react';
import { mutate } from 'swr';

import type { Importer } from 'types/importer';
import { IMPORTERS_API_PATH, createImporter } from 'api/importers';
import { useUsers } from 'hooks/useUsers';

export function useCreateImporter() {
  const { selectedUser } = useUsers();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(async (importer: Omit<Importer, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);

    try {
      const newImporter = await createImporter(importer);
      
      // update SWR cache manually
      mutate(selectedUser ? `${selectedUser}_${IMPORTERS_API_PATH}` : null, (importers: Importer[] = []) => [...importers, newImporter], false);

      return newImporter;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [selectedUser]);

  return { create, loading, error };
};
