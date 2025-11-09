import useSWR from 'swr';

import type { Account } from 'types/account';
import { ACCOUNTS_API_PATH, getAccounts } from 'api/accounts';
import { useUsers } from 'hooks/useUsers';

export const useAccounts = () => {
  const { selectedUser, loading: usersLoading } = useUsers();

  const swrKey = selectedUser ? `${selectedUser}_${ACCOUNTS_API_PATH}` : null;
  const { data, error, mutate, isLoading: accountsLoading } = useSWR<Account[], Error>(swrKey, getAccounts);

  const isLoading = accountsLoading || usersLoading;

  return {
    accounts: data ?? [],
    isLoading,
    error,
    refresh: mutate, // manual refresh
  };
};