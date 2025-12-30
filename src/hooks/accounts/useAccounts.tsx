import useSWR from 'swr';

import type { Account } from 'types/account';
import { ACCOUNTS_API_PATH, getAccounts } from 'api/accounts';

export const useAccounts = () => {
  const { data, error, mutate, isLoading } = useSWR<Account[], Error>(ACCOUNTS_API_PATH, getAccounts);

  return {
    accounts: data ?? [],
    isLoading,
    error,
    refresh: mutate, // manual refresh
  };
};