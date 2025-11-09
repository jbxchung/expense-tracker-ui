import { useState, useCallback } from 'react';
import { mutate } from 'swr';

import type { Account } from 'types/account';
import { ACCOUNTS_API_PATH, createAccount } from 'api/accounts';
import { useUsers } from 'hooks/useUsers';

export function useCreateAccount() {
  const { selectedUser } = useUsers();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(async (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const newAccount = await createAccount(account);

      // update SWR cache manually
      mutate(selectedUser ? `${selectedUser}_${ACCOUNTS_API_PATH}` : null, (accounts: Account[] = []) => [...accounts, newAccount], false);

      return newAccount;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
};
