import useSWR from 'swr';

import type { Importer } from 'types/importer';
import { IMPORTERS_API_PATH, getImporters } from 'api/importers';

export const useImporters = () => {
  const { data, error, mutate, isLoading } = useSWR<Importer[], Error>(IMPORTERS_API_PATH, getImporters);

  const sortedImporters = data?.sort((a, b) => a.name.localeCompare(b.name));

  return {
    importers: sortedImporters ?? [],
    isLoading,
    error,
    refresh: mutate, // manual refresh
  };
};