import useSWR from 'swr';

import type { Account } from 'types/account';
import type { User } from 'types/user';
import { ACCOUNTS_API_PATH, getAccounts } from 'api/accounts';

export const useAccounts = (selectedUser: User | null) => {
  const swrKey = selectedUser ? `${selectedUser.id}_${ACCOUNTS_API_PATH}` : null;
  const { data, error, mutate, isLoading: accountsLoading } = useSWR<Account[], Error>(swrKey, () => getAccounts(selectedUser));

  const isLoading = accountsLoading || !selectedUser;

  return {
    accounts: data ?? [],
    isLoading,
    error,
    refresh: mutate, // manual refresh
  };
};