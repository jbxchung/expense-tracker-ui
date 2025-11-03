import useSWR from 'swr';

import type { Account } from '../api/accounts';
import { ACCOUNTS_PATH, getAccounts } from '../api/accounts';

export const useAccounts = () => {
  const { data, error, mutate, isLoading } = useSWR<Account[], Error>(ACCOUNTS_PATH, getAccounts);

  return {
    accounts: data ?? [],
    error,
    isLoading,
    refresh: mutate, // manual refresh
  };
};