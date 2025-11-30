import { useState, useCallback } from 'react';
import { mutate } from 'swr';

import { DEFAULT_IMPORTER, type Importer } from 'types/importer';
import { IMPORTERS_API_PATH, createImporter, updateImporter } from 'api/importers';
import { useAppContext } from 'contexts/app/AppContext';

export function useSaveImporter() {
  const { selectedUser } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const save = useCallback(async (importer: Omit<Importer, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    setLoading(true);
    setError(null);

    try {
      let savedImporter: Importer | null = null;
      if (importer.id && importer.id !== DEFAULT_IMPORTER.id) {
        savedImporter = await updateImporter(importer as Importer & { id: string});
      } else {
        savedImporter = await createImporter(importer);
      }
      
      // update SWR cache manually
      mutate(selectedUser ? `${selectedUser}_${IMPORTERS_API_PATH}` : null, (importers: Importer[] = []) => (
        savedImporter
          ? [...importers.filter(i => i.id !== savedImporter!.id), savedImporter]
          : importers
      ), false);
      

      return savedImporter;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [selectedUser]);

  return { save, loading, error };
};
