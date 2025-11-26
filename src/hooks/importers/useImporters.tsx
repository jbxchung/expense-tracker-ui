import useSWR from 'swr';

import type { Importer } from 'types/importer';
import { IMPORTERS_API_PATH, getImporters } from 'api/importers';
import { useUsers } from 'hooks/useUsers';

export const useImporters = () => {
  // available importers depend on the current user
  const { selectedUser, loading: usersLoading } = useUsers();

  const swrKey = selectedUser ? `${selectedUser}_${IMPORTERS_API_PATH}` : null;
  const { data, error, mutate, isLoading: importersLoading } = useSWR<Importer[], Error>(swrKey, getImporters);

  const sortedImporters = data?.sort((a, b) =>
    (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0)
  );

  const isLoading = importersLoading || usersLoading;

  return {
    importers: sortedImporters ?? [],
    isLoading,
    error,
    refresh: mutate, // manual refresh
  };
};