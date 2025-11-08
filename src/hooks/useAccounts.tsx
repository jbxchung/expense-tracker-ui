import useSWR from 'swr';

import type { Account } from 'types/account';
import { ACCOUNTS_API_PATH, getAccounts } from 'api/accounts';
import { useUsers } from 'hooks/useUsers';

export const useAccounts = () => {
  const { selectedUser } = useUsers();
  const { data, error, mutate, isLoading } = useSWR<Account[], Error>(selectedUser ? `${selectedUser}_${ACCOUNTS_API_PATH}` : null, getAccounts);

  return {
    accounts: data ?? [],
    isLoading,
    error,
    refresh: mutate, // manual refresh
  };
};